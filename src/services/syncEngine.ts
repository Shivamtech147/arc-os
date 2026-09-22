import {
  getFirebaseInstance,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  deleteDoc,
  serverTimestamp
} from './firebase';
import * as db from '../db';
import { SyncStatusState, SyncQueueItem, AuthUser, BackupData } from '../types';

export const ALL_COLLECTIONS = [
  'settings',
  'days',
  'habits',
  'tasks',
  'focusSessions',
  'goals',
  'bodyLogs',
  'academicLogs',
  'subjects',
  'careerLogs',
  'digitalLogs',
  'journalEntries',
  'weeklyReviews',
  'rules',
  'recoveryEvents',
] as const;

type CollectionName = (typeof ALL_COLLECTIONS)[number];

class SyncEngine {
  private currentUser: AuthUser | null = null;
  private syncStatus: SyncStatusState = 'synced';
  private statusListeners: Array<(status: SyncStatusState, pendingCount: number) => void> = [];
  private unsubscribeMap: Map<string, () => void> = new Map();
  private isProcessingQueue = false;
  private refreshUICallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setSyncStatus(navigator.onLine ? 'syncing' : 'offline');
        this.processSyncQueue();
      });
      window.addEventListener('offline', () => {
        this.setSyncStatus('offline');
      });
    }
  }

  public setRefreshUICallback(cb: () => void) {
    this.refreshUICallback = cb;
  }

  public getStatus(): SyncStatusState {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
    return this.syncStatus;
  }

  public onStatusChange(listener: (status: SyncStatusState, pendingCount: number) => void) {
    this.statusListeners.push(listener);
    this.notifyStatusListeners();
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private async notifyStatusListeners() {
    const queue = await db.getSyncQueue();
    const count = queue.length;
    const currentStatus = this.getStatus();
    this.statusListeners.forEach((l) => l(currentStatus, count));
  }

  private setSyncStatus(status: SyncStatusState) {
    this.syncStatus = status;
    this.notifyStatusListeners();
  }

  // Handle Auth State Changes
  public async handleUserAuth(user: AuthUser | null) {
    this.currentUser = user;

    // Unsubscribe previous Firestore listeners
    this.unsubscribeMap.forEach((unsub) => unsub());
    this.unsubscribeMap.clear();

    if (!user) {
      this.setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      return;
    }

    // Step 1: Migration check for first-time login
    await this.migrateLocalDataToCloud(user.uid);

    // Step 2: Subscribe to real-time remote collections
    this.subscribeToRemoteCollections(user.uid);

    // Step 3: Process any offline queued actions
    await this.processSyncQueue();
  }

  // Real-time Cloud Subscriptions
  private subscribeToRemoteCollections(userId: string) {
    const { db: firestore } = getFirebaseInstance();
    if (!firestore) return;

    ALL_COLLECTIONS.forEach((collName) => {
      const collRef = collection(firestore, 'users', userId, collName);
      const unsub = onSnapshot(
        collRef,
        async (snapshot) => {
          this.setSyncStatus('saving');
          let hasLocalChanges = false;

          for (const change of snapshot.docChanges()) {
            const remoteData = change.doc.data();
            const docId = change.doc.id;

            if (change.type === 'removed' || remoteData.deletedAt) {
              // Soft delete locally
              await this.applyRemoteDelete(collName, docId);
              hasLocalChanges = true;
            } else if (change.type === 'added' || change.type === 'modified') {
              // Deterministic Conflict Resolution
              const updated = await this.applyRemoteUpsert(collName, docId, remoteData);
              if (updated) hasLocalChanges = true;
            }
          }

          if (hasLocalChanges && this.refreshUICallback) {
            this.refreshUICallback();
          }

          this.setSyncStatus('synced');
        },
        (error) => {
          console.warn(`Firestore sync notice for ${collName}:`, error);
          this.setSyncStatus('syncing');
        }
      );

      this.unsubscribeMap.set(collName, unsub);
    });
  }

  // Upsert Sync Action (Local -> Cloud or Queue)
  public async syncUpsert(collName: CollectionName, docId: string, payload: any): Promise<void> {
    const nowIso = new Date().toISOString();
    const enrichedPayload = {
      ...payload,
      id: docId,
      userId: this.currentUser?.uid || 'local',
      updatedAt: nowIso,
      createdAt: payload.createdAt || nowIso,
      deletedAt: null,
      version: (payload.version || 0) + 1,
    };

    // Save to local IndexedDB immediately
    await this.saveToLocalDB(collName, enrichedPayload);

    if (!this.currentUser || !navigator.onLine) {
      // Add to offline queue
      await db.addToSyncQueue({
        collectionName: collName,
        docId,
        action: 'upsert',
        payload: enrichedPayload,
      });
      this.setSyncStatus('offline');
      return;
    }

    // Push to Firestore
    try {
      this.setSyncStatus('saving');
      const { db: firestore } = getFirebaseInstance();
      if (firestore) {
        const docRef = doc(firestore, 'users', this.currentUser.uid, collName, docId);
        await setDoc(docRef, enrichedPayload, { merge: true });
      }
      this.setSyncStatus('synced');
    } catch (err) {
      console.warn('Network write failed, queuing offline item:', err);
      await db.addToSyncQueue({
        collectionName: collName,
        docId,
        action: 'upsert',
        payload: enrichedPayload,
      });
      this.setSyncStatus('offline');
    }
  }

  // Soft Delete Sync Action (Tombstone)
  public async syncDelete(collName: CollectionName, docId: string): Promise<void> {
    const nowIso = new Date().toISOString();
    const tombstonePayload = {
      id: docId,
      userId: this.currentUser?.uid || 'local',
      updatedAt: nowIso,
      deletedAt: nowIso,
    };

    // Remove from local IndexedDB
    await this.deleteFromLocalDB(collName, docId);

    if (!this.currentUser || !navigator.onLine) {
      await db.addToSyncQueue({
        collectionName: collName,
        docId,
        action: 'delete',
        payload: tombstonePayload,
      });
      this.setSyncStatus('offline');
      return;
    }

    try {
      this.setSyncStatus('saving');
      const { db: firestore } = getFirebaseInstance();
      if (firestore) {
        const docRef = doc(firestore, 'users', this.currentUser.uid, collName, docId);
        await setDoc(docRef, tombstonePayload, { merge: true });
      }
      this.setSyncStatus('synced');
    } catch (err) {
      await db.addToSyncQueue({
        collectionName: collName,
        docId,
        action: 'delete',
        payload: tombstonePayload,
      });
      this.setSyncStatus('offline');
    }
  }

  // Process & Drain Offline Queue
  public async processSyncQueue(): Promise<void> {
    if (this.isProcessingQueue || !this.currentUser || !navigator.onLine) return;
    this.isProcessingQueue = true;

    try {
      const queue = await db.getSyncQueue();
      if (queue.length === 0) {
        this.setSyncStatus('synced');
        this.isProcessingQueue = false;
        return;
      }

      this.setSyncStatus('syncing');
      const { db: firestore } = getFirebaseInstance();
      if (!firestore) {
        this.isProcessingQueue = false;
        return;
      }

      for (const item of queue) {
        try {
          const docRef = doc(firestore, 'users', this.currentUser.uid, item.collectionName, item.docId);
          if (item.action === 'upsert') {
            await setDoc(docRef, item.payload, { merge: true });
          } else if (item.action === 'delete') {
            await setDoc(docRef, { deletedAt: item.payload.deletedAt || new Date().toISOString() }, { merge: true });
          }
          await db.removeSyncQueueItem(item.id);
        } catch (err) {
          console.warn(`Failed to drain queue item ${item.id}:`, err);
        }
      }

      this.setSyncStatus('synced');
    } catch (err) {
      console.warn('Error processing sync queue:', err);
      this.setSyncStatus('error');
    } finally {
      this.isProcessingQueue = false;
      this.notifyStatusListeners();
    }
  }

  // Conflict Resolution Strategy
  private async applyRemoteUpsert(collName: CollectionName, docId: string, remoteData: any): Promise<boolean> {
    const local = await this.getFromLocalDB(collName, docId);
    if (!local) {
      await this.saveToLocalDB(collName, remoteData);
      return true;
    }

    const localUpdatedAt = local.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdatedAt = remoteData.updatedAt ? new Date(remoteData.updatedAt).getTime() : 0;

    if (remoteUpdatedAt >= localUpdatedAt) {
      // For Journal Entries: Non-destructive text merge if content differs
      let mergedData = remoteData;
      if (collName === 'journalEntries' && (local as any)?.eveningData && remoteData.eveningData) {
        const localJournal = local as any;
        mergedData = {
          ...remoteData,
          eveningData: {
            win: remoteData.eveningData.win || localJournal.eveningData.win,
            mistake: remoteData.eveningData.mistake || localJournal.eveningData.mistake,
            timeWasted: remoteData.eveningData.timeWasted || localJournal.eveningData.timeWasted,
            lesson: remoteData.eveningData.lesson || localJournal.eveningData.lesson,
            tomorrowMission: remoteData.eveningData.tomorrowMission || localJournal.eveningData.tomorrowMission,
          },
        };
      }

      await this.saveToLocalDB(collName, mergedData);
      return true;
    }

    return false;
  }

  private async applyRemoteDelete(collName: CollectionName, docId: string) {
    await this.deleteFromLocalDB(collName, docId);
  }

  // First-Login Local -> Cloud Migration
  private async migrateLocalDataToCloud(userId: string): Promise<void> {
    try {
      const { db: firestore } = getFirebaseInstance();
      if (!firestore) return;

      // Check if cloud already has user settings
      const userSettingsRef = doc(firestore, 'users', userId, 'settings', 'user_settings');
      const docSnap = await getDoc(userSettingsRef);

      if (!docSnap.exists()) {
        console.log('Performing first-login migration of local IndexedDB data to cloud account...');
        const backupStr = JSON.stringify(await db.exportAllData());
        localStorage.setItem(`ARC_OS_PRE_SYNC_BACKUP_${new Date().toISOString()}`, backupStr);

        const allData = await db.exportAllData();

        const uploadCollection = async (collName: CollectionName, items: any[]) => {
          if (!items || !items.length) return;
          const batch = writeBatch(firestore);
          items.forEach((item) => {
            const key = item.id || item.date || 'user_settings';
            if (key) {
              const itemRef = doc(firestore, 'users', userId, collName, key);
              batch.set(itemRef, { ...item, userId, updatedAt: item.updatedAt || new Date().toISOString() }, { merge: true });
            }
          });
          await batch.commit();
        };

        await uploadCollection('days', allData.days);
        await uploadCollection('habits', allData.habits);
        await uploadCollection('tasks', allData.tasks);
        await uploadCollection('focusSessions', allData.focusSessions);
        await uploadCollection('goals', allData.goals);
        await uploadCollection('bodyLogs', allData.bodyLogs);
        await uploadCollection('academicLogs', allData.academicLogs);
        await uploadCollection('subjects', allData.subjects);
        await uploadCollection('careerLogs', allData.careerLogs);
        await uploadCollection('digitalLogs', allData.digitalLogs);
        await uploadCollection('journalEntries', allData.journalEntries);
        await uploadCollection('weeklyReviews', allData.weeklyReviews);
        await uploadCollection('rules', allData.rules);
        await uploadCollection('recoveryEvents', allData.recoveryEvents);

        if (allData.settings) {
          await setDoc(userSettingsRef, { ...allData.settings, userId }, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Local data migration notice:', err);
    }
  }

  // Local DB Dispatchers
  private async saveToLocalDB(collName: CollectionName, item: any) {
    switch (collName) {
      case 'settings': return db.saveSettings(item);
      case 'days': return db.saveDayLog(item);
      case 'habits': return db.saveHabit(item);
      case 'tasks': return db.saveTask(item);
      case 'focusSessions': return db.saveFocusSession(item);
      case 'goals': return db.saveGoal(item);
      case 'bodyLogs': return db.saveBodyLog(item);
      case 'academicLogs': return db.saveAcademicLog(item);
      case 'subjects': return db.saveSubject(item);
      case 'careerLogs': return db.saveCareerLog(item);
      case 'digitalLogs': return db.saveDigitalLog(item);
      case 'journalEntries': return db.saveJournalEntry(item);
      case 'weeklyReviews': return db.saveWeeklyReview(item);
      case 'rules': return db.saveRule(item);
      case 'recoveryEvents': return db.saveRecoveryEvent(item);
    }
  }

  private async getFromLocalDB(collName: CollectionName, id: string) {
    switch (collName) {
      case 'settings': return db.getSettings();
      case 'days': return db.getDayLog(id);
      case 'habits': return (await db.getHabits()).find((h) => h.id === id);
      case 'tasks': return (await db.getAllTasks()).find((t) => t.id === id);
      case 'focusSessions': return (await db.getFocusSessions()).find((f) => f.id === id);
      case 'goals': return (await db.getGoals()).find((g) => g.id === id);
      case 'bodyLogs': return (await db.getBodyLogs()).find((b) => b.date === id);
      case 'academicLogs': return (await db.getAcademicLogs()).find((a) => a.date === id);
      case 'subjects': return (await db.getSubjects()).find((s) => s.id === id);
      case 'careerLogs': return (await db.getCareerLogs()).find((c) => c.date === id);
      case 'digitalLogs': return (await db.getDigitalLogs()).find((d) => d.date === id);
      case 'journalEntries': return (await db.getJournalEntries()).find((j) => j.id === id);
      case 'weeklyReviews': return (await db.getWeeklyReviews()).find((w) => w.id === id);
      case 'rules': return (await db.getRules()).find((r) => r.id === id);
      case 'recoveryEvents': return (await db.getRecoveryEvents()).find((rc) => rc.id === id);
    }
  }

  private async deleteFromLocalDB(collName: CollectionName, id: string) {
    switch (collName) {
      case 'habits': return db.deleteHabit(id);
      case 'tasks': return db.deleteTask(id);
      case 'goals': return db.deleteGoal(id);
      case 'subjects': return db.deleteSubject(id);
      case 'rules': return db.deleteRule(id);
      default: return;
    }
  }
}

export const syncEngine = new SyncEngine();
