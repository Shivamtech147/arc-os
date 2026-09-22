import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  UserSettings,
  DayLog,
  Habit,
  Task,
  FocusSession,
  Goal,
  BodyLog,
  AcademicLog,
  AcademicSubject,
  CareerLog,
  DigitalLog,
  JournalEntry,
  WeeklyReview,
  ArcRule,
  RecoveryEvent,
  BackupData,
  SyncQueueItem
} from '../types';

export const CURRENT_SCHEMA_VERSION = 1;
export const APP_VERSION = '1.0.0';

interface ArcOSDatabase extends DBSchema {
  settings: {
    key: string;
    value: UserSettings;
  };
  days: {
    key: string; // YYYY-MM-DD
    value: DayLog;
    indexes: { 'by-date': string };
  };
  habits: {
    key: string;
    value: Habit;
  };
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-date': string };
  };
  focusSessions: {
    key: string;
    value: FocusSession;
    indexes: { 'by-date': string };
  };
  goals: {
    key: string;
    value: Goal;
  };
  bodyLogs: {
    key: string; // YYYY-MM-DD
    value: BodyLog;
  };
  academicLogs: {
    key: string; // YYYY-MM-DD
    value: AcademicLog;
  };
  subjects: {
    key: string;
    value: AcademicSubject;
  };
  careerLogs: {
    key: string; // YYYY-MM-DD
    value: CareerLog;
  };
  digitalLogs: {
    key: string; // YYYY-MM-DD
    value: DigitalLog;
  };
  journalEntries: {
    key: string;
    value: JournalEntry;
    indexes: { 'by-date': string };
  };
  weeklyReviews: {
    key: string;
    value: WeeklyReview;
  };
  rules: {
    key: string;
    value: ArcRule;
  };
  recoveryEvents: {
    key: string;
    value: RecoveryEvent;
    indexes: { 'by-date': string };
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-timestamp': string };
  };
}

const DB_NAME = 'arc_os_db';

export const DEFAULT_RULES: ArcRule[] = [
  { id: 'rule-1', title: '1. No Zero Days', description: 'Every single day must contain at least one meaningful, non-negotiable action.', isDefault: true },
  { id: 'rule-2', title: '2. Never Miss Twice', description: 'A single miss is a stumble; two consecutive misses is a failure of system discipline. Reset immediately.', isDefault: true },
  { id: 'rule-3', title: '3. Important Work Before Entertainment', description: 'Lock in and execute high-leverage cognitive priorities before opening dopamine feeds.', isDefault: true },
  { id: 'rule-4', title: '4. Minimum Version > Zero', description: 'When energy is low or chaos erupts, execute your configured minimum version instead of quitting.', isDefault: true },
  { id: 'rule-5', title: '5. Sleep Is Training', description: 'Sleep is non-negotiable recovery. Treat target sleep hours as mandatory physical preparation.', isDefault: true },
  { id: 'rule-6', title: "6. Don't Negotiate During Lock-In", description: 'Once a Lock-In timer starts, execution is total. No phone checking, no switching tasks, no excuses.', isDefault: true },
  { id: 'rule-7', title: '7. Weekly Review Is Mandatory', description: 'Every 7 days, pause, analyze performance metrics, confront failures, and adjust parameters.', isDefault: true },
  { id: 'rule-8', title: '8. One Bad Day Does Not Become a Bad Week', description: 'Forgive yourself for a bad day, execute the Recovery Protocol, and lock in the next morning.', isDefault: true },
];

export const DEFAULT_HABITS: Habit[] = [
  { id: 'habit-gym', title: 'Gym & Physical Training', category: 'body', isCore: true, minimumVersion: '10-minute push-up / stretch session', consecutiveMisses: 0, lastLoggedDate: null },
  { id: 'habit-deepwork', title: 'Deep Work & Academics', category: 'academics', isCore: true, minimumVersion: '20-minute focused study block', consecutiveMisses: 0, lastLoggedDate: null },
  { id: 'habit-career', title: 'Career & Problem Solving', category: 'career', isCore: true, minimumVersion: 'Solve 1 LeetCode / DSA problem', consecutiveMisses: 0, lastLoggedDate: null },
  { id: 'habit-sleep', title: 'Sleep Target (7-8 Hrs)', category: 'sleep', isCore: true, minimumVersion: 'In bed by target time, no screen', consecutiveMisses: 0, lastLoggedDate: null },
  { id: 'habit-journal', title: 'Daily Reflection & Journal', category: 'mind', isCore: true, minimumVersion: 'Write 3 sentences in evening journal', consecutiveMisses: 0, lastLoggedDate: null },
  { id: 'habit-digital', title: 'Digital Discipline', category: 'digital', isCore: true, minimumVersion: 'Zero unplanned social media scrolling', consecutiveMisses: 0, lastLoggedDate: null },
];

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Operator',
  startDate: new Date().toISOString().split('T')[0],
  totalDays: 90,
  wakeTime: '06:00',
  sleepTargetHours: 8,
  studyTargetHours: 4,
  careerTargetHours: 3,
  gymTargetSessions: 5,
  coreScoreCategories: ['body', 'academics', 'career', 'mind', 'sleep', 'digital'],
  onboardingCompleted: false,
  lastBackupDate: null,
  schemaVersion: CURRENT_SCHEMA_VERSION,
};

let dbPromise: Promise<IDBPDatabase<ArcOSDatabase>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ArcOSDatabase>(DB_NAME, CURRENT_SCHEMA_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading IndexedDB from schema v${oldVersion} to v${newVersion}`);

        if (oldVersion < 1) {
          db.createObjectStore('settings');
          
          const daysStore = db.createObjectStore('days', { keyPath: 'date' });
          daysStore.createIndex('by-date', 'date');

          db.createObjectStore('habits', { keyPath: 'id' });

          const tasksStore = db.createObjectStore('tasks', { keyPath: 'id' });
          tasksStore.createIndex('by-date', 'date');

          const focusStore = db.createObjectStore('focusSessions', { keyPath: 'id' });
          focusStore.createIndex('by-date', 'date');

          db.createObjectStore('goals', { keyPath: 'id' });
          db.createObjectStore('bodyLogs', { keyPath: 'date' });
          db.createObjectStore('academicLogs', { keyPath: 'date' });
          db.createObjectStore('subjects', { keyPath: 'id' });
          db.createObjectStore('careerLogs', { keyPath: 'date' });
          db.createObjectStore('digitalLogs', { keyPath: 'date' });

          const journalStore = db.createObjectStore('journalEntries', { keyPath: 'id' });
          journalStore.createIndex('by-date', 'date');

          db.createObjectStore('weeklyReviews', { keyPath: 'id' });
          db.createObjectStore('rules', { keyPath: 'id' });

          const recoveryStore = db.createObjectStore('recoveryEvents', { keyPath: 'id' });
          recoveryStore.createIndex('by-date', 'date');

          const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          queueStore.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

// Database Initialization & Seeding Helper
export async function initializeDatabase(): Promise<UserSettings> {
  const db = await getDB();
  let settings = await db.get('settings', 'user_settings');

  if (!settings) {
    settings = { ...DEFAULT_SETTINGS };
    await db.put('settings', settings, 'user_settings');

    // Seed default rules
    const txRules = db.transaction('rules', 'readwrite');
    for (const rule of DEFAULT_RULES) {
      await txRules.store.put(rule);
    }
    await txRules.done;

    // Seed default habits
    const txHabits = db.transaction('habits', 'readwrite');
    for (const habit of DEFAULT_HABITS) {
      await txHabits.store.put(habit);
    }
    await txHabits.done;
  }

  return settings;
}

// Data Access API
export async function getSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'user_settings');
  return settings || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'user_settings');
}

export async function getDayLog(date: string): Promise<DayLog | undefined> {
  const db = await getDB();
  return db.get('days', date);
}

export async function getAllDayLogs(): Promise<DayLog[]> {
  const db = await getDB();
  return db.getAll('days');
}

export async function saveDayLog(dayLog: DayLog): Promise<void> {
  const db = await getDB();
  await db.put('days', dayLog);
}

export async function getHabits(): Promise<Habit[]> {
  const db = await getDB();
  return db.getAll('habits');
}

export async function saveHabit(habit: Habit): Promise<void> {
  const db = await getDB();
  await db.put('habits', habit);
}

export async function deleteHabit(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('habits', id);
}

export async function getTasksByDate(date: string): Promise<Task[]> {
  const db = await getDB();
  const index = db.transaction('tasks').store.index('by-date');
  return index.getAll(date);
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDB();
  return db.getAll('tasks');
}

export async function saveTask(task: Task): Promise<void> {
  const db = await getDB();
  await db.put('tasks', task);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tasks', id);
}

export async function getFocusSessions(): Promise<FocusSession[]> {
  const db = await getDB();
  return db.getAll('focusSessions');
}

export async function saveFocusSession(session: FocusSession): Promise<void> {
  const db = await getDB();
  await db.put('focusSessions', session);
}

export async function getGoals(): Promise<Goal[]> {
  const db = await getDB();
  return db.getAll('goals');
}

export async function saveGoal(goal: Goal): Promise<void> {
  const db = await getDB();
  await db.put('goals', goal);
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('goals', id);
}

export async function getBodyLogs(): Promise<BodyLog[]> {
  const db = await getDB();
  return db.getAll('bodyLogs');
}

export async function saveBodyLog(log: BodyLog): Promise<void> {
  const db = await getDB();
  await db.put('bodyLogs', log);
}

export async function getAcademicLogs(): Promise<AcademicLog[]> {
  const db = await getDB();
  return db.getAll('academicLogs');
}

export async function saveAcademicLog(log: AcademicLog): Promise<void> {
  const db = await getDB();
  await db.put('academicLogs', log);
}

export async function getSubjects(): Promise<AcademicSubject[]> {
  const db = await getDB();
  return db.getAll('subjects');
}

export async function saveSubject(subject: AcademicSubject): Promise<void> {
  const db = await getDB();
  await db.put('subjects', subject);
}

export async function deleteSubject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('subjects', id);
}

export async function getCareerLogs(): Promise<CareerLog[]> {
  const db = await getDB();
  return db.getAll('careerLogs');
}

export async function saveCareerLog(log: CareerLog): Promise<void> {
  const db = await getDB();
  await db.put('careerLogs', log);
}

export async function getDigitalLogs(): Promise<DigitalLog[]> {
  const db = await getDB();
  return db.getAll('digitalLogs');
}

export async function saveDigitalLog(log: DigitalLog): Promise<void> {
  const db = await getDB();
  await db.put('digitalLogs', log);
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  return db.getAll('journalEntries');
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB();
  await db.put('journalEntries', entry);
}

export async function getWeeklyReviews(): Promise<WeeklyReview[]> {
  const db = await getDB();
  return db.getAll('weeklyReviews');
}

export async function saveWeeklyReview(review: WeeklyReview): Promise<void> {
  const db = await getDB();
  await db.put('weeklyReviews', review);
}

export async function getRules(): Promise<ArcRule[]> {
  const db = await getDB();
  return db.getAll('rules');
}

export async function saveRule(rule: ArcRule): Promise<void> {
  const db = await getDB();
  await db.put('rules', rule);
}

export async function deleteRule(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('rules', id);
}

export async function getRecoveryEvents(): Promise<RecoveryEvent[]> {
  const db = await getDB();
  return db.getAll('recoveryEvents');
}

export async function saveRecoveryEvent(event: RecoveryEvent): Promise<void> {
  const db = await getDB();
  await db.put('recoveryEvents', event);
}

// Maintenance & Export / Import Engine
export async function exportAllData(): Promise<BackupData> {
  const db = await getDB();
  const settings = (await db.get('settings', 'user_settings')) || DEFAULT_SETTINGS;
  const days = await db.getAll('days');
  const habits = await db.getAll('habits');
  const tasks = await db.getAll('tasks');
  const focusSessions = await db.getAll('focusSessions');
  const goals = await db.getAll('goals');
  const bodyLogs = await db.getAll('bodyLogs');
  const academicLogs = await db.getAll('academicLogs');
  const subjects = await db.getAll('subjects');
  const careerLogs = await db.getAll('careerLogs');
  const digitalLogs = await db.getAll('digitalLogs');
  const journalEntries = await db.getAll('journalEntries');
  const weeklyReviews = await db.getAll('weeklyReviews');
  const rules = await db.getAll('rules');
  const recoveryEvents = await db.getAll('recoveryEvents');

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportDate: new Date().toISOString(),
    settings,
    days,
    habits,
    tasks,
    focusSessions,
    goals,
    bodyLogs,
    academicLogs,
    subjects,
    careerLogs,
    digitalLogs,
    journalEntries,
    weeklyReviews,
    rules,
    recoveryEvents,
  };
}

export async function importData(backup: BackupData, mode: 'replace' | 'merge'): Promise<void> {
  // Validate backup payload
  if (!backup || typeof backup !== 'object' || typeof backup.schemaVersion !== 'number') {
    throw new Error('Invalid backup file format: missing schemaVersion');
  }

  const db = await getDB();

  // Migration logic if backup schemaVersion differs
  let migratedBackup = backup;
  if (backup.schemaVersion < CURRENT_SCHEMA_VERSION) {
    migratedBackup = migrateBackupSchema(backup);
  }

  if (mode === 'replace') {
    await clearAllStores();
  }

  // Restore settings
  if (migratedBackup.settings) {
    await db.put('settings', migratedBackup.settings, 'user_settings');
  }

  // Helper batch insert
  const batchPut = async <T>(storeName: any, items?: T[]) => {
    if (!items || !Array.isArray(items)) return;
    const tx = db.transaction(storeName, 'readwrite');
    for (const item of items) {
      await tx.store.put(item);
    }
    await tx.done;
  };

  await batchPut('days', migratedBackup.days);
  await batchPut('habits', migratedBackup.habits);
  await batchPut('tasks', migratedBackup.tasks);
  await batchPut('focusSessions', migratedBackup.focusSessions);
  await batchPut('goals', migratedBackup.goals);
  await batchPut('bodyLogs', migratedBackup.bodyLogs);
  await batchPut('academicLogs', migratedBackup.academicLogs);
  await batchPut('subjects', migratedBackup.subjects);
  await batchPut('careerLogs', migratedBackup.careerLogs);
  await batchPut('digitalLogs', migratedBackup.digitalLogs);
  await batchPut('journalEntries', migratedBackup.journalEntries);
  await batchPut('weeklyReviews', migratedBackup.weeklyReviews);
  await batchPut('rules', migratedBackup.rules);
  await batchPut('recoveryEvents', migratedBackup.recoveryEvents);
}

function migrateBackupSchema(backup: any): BackupData {
  // Safe forward migration wrapper preserving unknown fields
  console.log(`Migrating backup from v${backup.schemaVersion} to v${CURRENT_SCHEMA_VERSION}`);
  return {
    ...backup,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}

export async function clearAllStores(): Promise<void> {
  const db = await getDB();
  const storeNames = [
    'days', 'habits', 'tasks', 'focusSessions', 'goals',
    'bodyLogs', 'academicLogs', 'subjects', 'careerLogs',
    'digitalLogs', 'journalEntries', 'weeklyReviews', 'rules', 'recoveryEvents'
  ] as const;

  for (const name of storeNames) {
    await db.clear(name);
  }
}

export async function getDatabaseRecordCounts() {
  const db = await getDB();
  return {
    daysCount: (await db.getAllKeys('days')).length,
    tasksCount: (await db.getAllKeys('tasks')).length,
    habitsCount: (await db.getAllKeys('habits')).length,
    focusSessionsCount: (await db.getAllKeys('focusSessions')).length,
    goalsCount: (await db.getAllKeys('goals')).length,
    journalEntriesCount: (await db.getAllKeys('journalEntries')).length,
    recoveryEventsCount: (await db.getAllKeys('recoveryEvents')).length,
    syncQueueCount: (await db.getAllKeys('syncQueue')).length,
  };
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  return db.getAll('syncQueue');
}

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<void> {
  const db = await getDB();
  const queueItem: SyncQueueItem = {
    ...item,
    id: 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
  };
  await db.put('syncQueue', queueItem);
}

export async function removeSyncQueueItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('syncQueue', id);
}

export async function clearSyncQueue(): Promise<void> {
  const db = await getDB();
  await db.clear('syncQueue');
}
