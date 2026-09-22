import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  AuthUser,
  SyncStatusState
} from '../types';
import * as db from '../db';
import {
  subscribeToAuthState,
  loginWithGoogle,
  checkRedirectResult,
  loginWithEmail,
  logoutUser
} from '../services/firebase';
import { syncEngine } from '../services/syncEngine';

interface AppContextType {
  loading: boolean;
  user: AuthUser | null;
  syncStatus: SyncStatusState;
  pendingQueueCount: number;

  settings: UserSettings;
  todayLog: DayLog;
  habits: Habit[];
  tasks: Task[];
  allTasks: Task[];
  focusSessions: FocusSession[];
  goals: Goal[];
  bodyLogs: BodyLog[];
  academicLogs: AcademicLog[];
  subjects: AcademicSubject[];
  careerLogs: CareerLog[];
  digitalLogs: DigitalLog[];
  journalEntries: JournalEntry[];
  weeklyReviews: WeeklyReview[];
  rules: ArcRule[];
  recoveryEvents: RecoveryEvent[];
  allDayLogs: DayLog[];

  isLocalMode: boolean;
  currentDateStr: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 90
  todayScore: number; // 0 to 6
  scoreLabel: string;
  currentStreak: number;
  needsBackupReminder: boolean;

  // Auth Actions
  signInWithGoogleProvider: () => Promise<void>;
  signInWithEmailPass: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Data Actions
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  toggleHabit: (habitId: string, dateStr?: string) => Promise<void>;
  updateDayMissions: (dateStr: string, missions: { main?: string; academic?: string; career?: string; body?: string }) => Promise<void>;
  updateDayReflection: (dateStr: string, reflection: DayLog['reflection']) => Promise<void>;
  setNoZeroAction: (dateStr: string, action: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => Promise<void>;

  saveGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  saveBodyLog: (log: Partial<BodyLog>) => Promise<void>;
  saveAcademicLog: (log: Partial<AcademicLog>) => Promise<void>;
  saveSubject: (subject: AcademicSubject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  saveCareerLog: (log: Partial<CareerLog>) => Promise<void>;
  saveDigitalLog: (log: Partial<DigitalLog>) => Promise<void>;
  saveJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  saveWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'savedAt'>) => Promise<void>;

  addRule: (rule: Omit<ArcRule, 'id' | 'isDefault'>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;

  triggerRecovery: (reason: string, protocolApplied: string, notes?: string) => Promise<void>;

  exportBackup: () => Promise<string>;
  postExportVerifiedDownload: () => Promise<{ success: boolean; filename?: string; error?: string }>;
  importBackup: (jsonContent: string, mode: 'replace' | 'merge') => Promise<{ success: boolean; error?: string }>;
  dismissBackupReminder: () => void;
  runIntegrityCheck: () => Promise<db.DatabaseHealthReport>;
  resetAllAppData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateDayNumber(startDateStr: string, currentDateStr: string): number {
  const start = new Date(startDateStr);
  const current = new Date(currentDateStr);
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diffDays, 90));
}

export function getScoreLabel(score: number): string {
  if (score >= 6) return 'Excellent';
  if (score === 5) return 'Strong';
  if (score === 4) return 'Acceptable';
  if (score === 3) return 'Warning';
  return 'Recovery Required';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDateStr = getTodayDateStr();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>('synced');
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  const [settings, setSettingsState] = useState<UserSettings>(db.DEFAULT_SETTINGS);
  const [allDayLogs, setAllDayLogs] = useState<DayLog[]>([]);
  const [todayLog, setTodayLog] = useState<DayLog>({
    date: currentDateStr,
    dayNumber: 1,
    score: 0,
    habitsCompleted: {},
    mainMission: '',
  });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>([]);
  const [academicLogs, setAcademicLogs] = useState<AcademicLog[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [careerLogs, setCareerLogs] = useState<CareerLog[]>([]);
  const [digitalLogs, setDigitalLogs] = useState<DigitalLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [rules, setRules] = useState<ArcRule[]>([]);
  const [recoveryEvents, setRecoveryEvents] = useState<RecoveryEvent[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const userSettings = await db.initializeDatabase();
      setSettingsState(userSettings);

      const fetchedHabits = await db.getHabits();
      setHabits(fetchedHabits);

      const fetchedRules = await db.getRules();
      setRules(fetchedRules);

      const fetchedDays = await db.getAllDayLogs();
      setAllDayLogs(fetchedDays);

      const calculatedDayNumber = calculateDayNumber(userSettings.startDate, currentDateStr);

      let currentDay = fetchedDays.find((d) => d.date === currentDateStr);
      if (!currentDay) {
        currentDay = {
          date: currentDateStr,
          dayNumber: calculatedDayNumber,
          score: 0,
          habitsCompleted: {},
          mainMission: '',
        };
        await db.saveDayLog(currentDay);
        setAllDayLogs((prev) => [...prev.filter((d) => d.date !== currentDateStr), currentDay!]);
      }
      setTodayLog(currentDay);

      setAllTasks(await db.getAllTasks());
      setFocusSessions(await db.getFocusSessions());
      setGoals(await db.getGoals());
      setBodyLogs(await db.getBodyLogs());
      setAcademicLogs(await db.getAcademicLogs());
      setSubjects(await db.getSubjects());
      setCareerLogs(await db.getCareerLogs());
      setDigitalLogs(await db.getDigitalLogs());
      setJournalEntries(await db.getJournalEntries());
      setWeeklyReviews(await db.getWeeklyReviews());
      setRecoveryEvents(await db.getRecoveryEvents());
    } catch (err) {
      console.error('Failed to load IndexedDB data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDateStr]);

  useEffect(() => {
    loadData();

    // Check for Firebase Auth Redirect Result (fallback from popup-blocked)
    checkRedirectResult().then(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await syncEngine.handleUserAuth(authUser);
        await loadData();
      }
    }).catch((err) => {
      console.warn('Redirect auth check notice:', err);
    });

    // Subscribe to Sync Engine Status
    const unsubStatus = syncEngine.onStatusChange((status, pendingCount) => {
      setSyncStatus(status);
      setPendingQueueCount(pendingCount);
    });

    syncEngine.setRefreshUICallback(() => {
      loadData();
    });

    // Subscribe to Firebase Auth State
    const unsubAuth = subscribeToAuthState(async (authUser) => {
      setUser(authUser);
      await syncEngine.handleUserAuth(authUser);
      await loadData();
    });

    return () => {
      unsubStatus();
      unsubAuth();
    };
  }, [loadData]);

  // Auth Operations
  const signInWithGoogleProvider = async () => {
    const authUser = await loginWithGoogle();
    if (authUser) {
      setUser(authUser);
      await syncEngine.handleUserAuth(authUser);
      await loadData();
    }
  };

  const signInWithEmailPass = async (email: string, pass: string) => {
    const authUser = await loginWithEmail(email, pass);
    if (authUser) {
      setUser(authUser);
      await syncEngine.handleUserAuth(authUser);
      await loadData();
    }
  };

  const signOut = async () => {
    await logoutUser();
    setUser(null);
    await syncEngine.handleUserAuth(null);
  };

  // Recalculate score & streak
  const dayNumber = calculateDayNumber(settings.startDate, currentDateStr);

  const calculateScore = useCallback((day: DayLog, habitList: Habit[], userSet: UserSettings): number => {
    if (!day || !day.habitsCompleted) return 0;
    const coreCats = userSet.coreScoreCategories || ['body', 'academics', 'career', 'mind', 'sleep', 'digital'];
    let score = 0;

    coreCats.forEach((cat) => {
      const catHabits = habitList.filter((h) => h.category === cat);
      if (catHabits.length > 0) {
        const anyDone = catHabits.some((h) => day.habitsCompleted[h.id] === true);
        if (anyDone) score += 1;
      }
    });

    return score;
  }, []);

  const todayScore = calculateScore(todayLog, habits, settings);
  const scoreLabel = getScoreLabel(todayScore);

  const calculateStreak = useCallback((days: DayLog[]): number => {
    if (!days || days.length === 0) return 0;
    const sortedDays = [...days].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    for (const d of sortedDays) {
      if (d.score >= 4 || Object.values(d.habitsCompleted || {}).some(Boolean)) {
        streak++;
      } else if (d.date !== getTodayDateStr()) {
        break;
      }
    }
    return streak;
  }, []);

  const currentStreak = calculateStreak(allDayLogs);

  const [backupSnoozed, setBackupSnoozed] = useState(false);
  const dismissBackupReminder = () => {
    setBackupSnoozed(true);
  };

  const needsBackupReminder = React.useMemo(() => {
    if (backupSnoozed) return false;
    if (!settings.lastBackupDate) return true;
    const last = new Date(settings.lastBackupDate).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - last) / (1000 * 60 * 60 * 24);
    return daysDiff >= 7;
  }, [settings.lastBackupDate, backupSnoozed]);

  // Actions wrapped with syncEngine
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    await syncEngine.syncUpsert('settings', 'user_settings', updated);
  };

  const toggleHabit = async (habitId: string, dateStr: string = currentDateStr) => {
    const dayToUpdate = allDayLogs.find((d) => d.date === dateStr) || {
      date: dateStr,
      dayNumber: calculateDayNumber(settings.startDate, dateStr),
      score: 0,
      habitsCompleted: {},
      mainMission: '',
    };

    const newCompleted = {
      ...dayToUpdate.habitsCompleted,
      [habitId]: !dayToUpdate.habitsCompleted[habitId],
    };

    const updatedScore = calculateScore({ ...dayToUpdate, habitsCompleted: newCompleted }, habits, settings);

    const updatedDay: DayLog = {
      ...dayToUpdate,
      habitsCompleted: newCompleted,
      score: updatedScore,
    };

    setAllDayLogs((prev) => [...prev.filter((d) => d.date !== dateStr), updatedDay]);
    if (dateStr === currentDateStr) setTodayLog(updatedDay);

    await syncEngine.syncUpsert('days', dateStr, updatedDay);

    const habitObj = habits.find((h) => h.id === habitId);
    if (habitObj) {
      const isDoneNow = newCompleted[habitId];
      const updatedHabit: Habit = {
        ...habitObj,
        lastLoggedDate: isDoneNow ? dateStr : habitObj.lastLoggedDate,
        consecutiveMisses: isDoneNow ? 0 : habitObj.consecutiveMisses,
      };
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updatedHabit : h)));
      await syncEngine.syncUpsert('habits', habitId, updatedHabit);
    }
  };

  const updateDayMissions = async (dateStr: string, missions: { main?: string; academic?: string; career?: string; body?: string }) => {
    const existing = allDayLogs.find((d) => d.date === dateStr) || todayLog;
    const updated: DayLog = {
      ...existing,
      mainMission: missions.main !== undefined ? missions.main : existing.mainMission,
      academicMission: missions.academic !== undefined ? missions.academic : existing.academicMission,
      careerMission: missions.career !== undefined ? missions.career : existing.careerMission,
      bodyMission: missions.body !== undefined ? missions.body : existing.bodyMission,
    };

    setAllDayLogs((prev) => [...prev.filter((d) => d.date !== dateStr), updated]);
    if (dateStr === currentDateStr) setTodayLog(updated);
    await syncEngine.syncUpsert('days', dateStr, updated);
  };

  const updateDayReflection = async (dateStr: string, reflection: DayLog['reflection']) => {
    const existing = allDayLogs.find((d) => d.date === dateStr) || todayLog;
    const updated: DayLog = {
      ...existing,
      reflection: { ...existing.reflection, ...reflection },
    };
    setAllDayLogs((prev) => [...prev.filter((d) => d.date !== dateStr), updated]);
    if (dateStr === currentDateStr) setTodayLog(updated);
    await syncEngine.syncUpsert('days', dateStr, updated);
  };

  const setNoZeroAction = async (dateStr: string, action: string) => {
    const existing = allDayLogs.find((d) => d.date === dateStr) || todayLog;
    const updated: DayLog = { ...existing, noZeroAction: action };
    setAllDayLogs((prev) => [...prev.filter((d) => d.date !== dateStr), updated]);
    if (dateStr === currentDateStr) setTodayLog(updated);
    await syncEngine.syncUpsert('days', dateStr, updated);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newId = 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newTask: Task = {
      ...taskData,
      id: newId,
      completed: false,
      completedAt: null,
    };
    setAllTasks((prev) => [...prev, newTask]);
    await syncEngine.syncUpsert('tasks', newId, newTask);
  };

  const toggleTask = async (id: string) => {
    const task = allTasks.find((t) => t.id === id);
    if (!task) return;
    const updated: Task = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
    };
    setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await syncEngine.syncUpsert('tasks', id, updated);
  };

  const deleteTask = async (id: string) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
    await syncEngine.syncDelete('tasks', id);
  };

  const addFocusSession = async (sessionData: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const newId = 'focus-' + Date.now();
    const newSession: FocusSession = {
      ...sessionData,
      id: newId,
      timestamp: new Date().toISOString(),
    };
    setFocusSessions((prev) => [...prev, newSession]);
    await syncEngine.syncUpsert('focusSessions', newId, newSession);
  };

  const saveGoal = async (goal: Goal) => {
    setGoals((prev) => [...prev.filter((g) => g.id !== goal.id), goal]);
    await syncEngine.syncUpsert('goals', goal.id, goal);
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await syncEngine.syncDelete('goals', id);
  };

  const saveBodyLog = async (logData: Partial<BodyLog>) => {
    const date = logData.date || currentDateStr;
    const existing = bodyLogs.find((b) => b.date === date) || { date, gymCompleted: false, id: date };
    const updated: BodyLog = { ...existing, ...logData, date, id: date };
    setBodyLogs((prev) => [...prev.filter((b) => b.date !== date), updated]);
    await syncEngine.syncUpsert('bodyLogs', date, updated);
  };

  const saveAcademicLog = async (logData: Partial<AcademicLog>) => {
    const date = logData.date || currentDateStr;
    const existing = academicLogs.find((a) => a.date === date) || { date, studyHours: 0, deepWorkHours: 0, revisionHours: 0, id: date };
    const updated: AcademicLog = { ...existing, ...logData, date, id: date };
    setAcademicLogs((prev) => [...prev.filter((a) => a.date !== date), updated]);
    await syncEngine.syncUpsert('academicLogs', date, updated);
  };

  const saveSubject = async (subject: AcademicSubject) => {
    setSubjects((prev) => [...prev.filter((s) => s.id !== subject.id), subject]);
    await syncEngine.syncUpsert('subjects', subject.id, subject);
  };

  const deleteSubject = async (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    await syncEngine.syncDelete('subjects', id);
  };

  const saveCareerLog = async (logData: Partial<CareerLog>) => {
    const date = logData.date || currentDateStr;
    const existing = careerLogs.find((c) => c.date === date) || { date, dsaProblemsCount: 0, codingHours: 0, mlHours: 0, applicationsSubmitted: 0, id: date };
    const updated: CareerLog = { ...existing, ...logData, date, id: date };
    setCareerLogs((prev) => [...prev.filter((c) => c.date !== date), updated]);
    await syncEngine.syncUpsert('careerLogs', date, updated);
  };

  const saveDigitalLog = async (logData: Partial<DigitalLog>) => {
    const date = logData.date || currentDateStr;
    const existing = digitalLogs.find((d) => d.date === date) || { date, instagramMinutes: 0, youtubeMinutes: 0, totalScreenTimeMinutes: 0, pornFree: true, unplannedScrollingCount: 0, id: date };
    const updated: DigitalLog = { ...existing, ...logData, date, id: date };
    setDigitalLogs((prev) => [...prev.filter((d) => d.date !== date), updated]);
    await syncEngine.syncUpsert('digitalLogs', date, updated);
  };

  const saveJournalEntry = async (entryData: Omit<JournalEntry, 'id'>) => {
    const id = `journal-${entryData.date}-${entryData.type}`;
    const entry: JournalEntry = { ...entryData, id };
    setJournalEntries((prev) => [...prev.filter((j) => j.id !== id), entry]);
    await syncEngine.syncUpsert('journalEntries', id, entry);
  };

  const saveWeeklyReview = async (reviewData: Omit<WeeklyReview, 'id' | 'savedAt'>) => {
    const id = `week-${reviewData.weekNumber}`;
    const review: WeeklyReview = {
      ...reviewData,
      id,
      savedAt: new Date().toISOString(),
    };
    setWeeklyReviews((prev) => [...prev.filter((w) => w.id !== id), review]);
    await syncEngine.syncUpsert('weeklyReviews', id, review);
  };

  const addRule = async (ruleData: Omit<ArcRule, 'id' | 'isDefault'>) => {
    const id = 'rule-' + Date.now();
    const newRule: ArcRule = {
      ...ruleData,
      id,
      isDefault: false,
    };
    setRules((prev) => [...prev, newRule]);
    await syncEngine.syncUpsert('rules', id, newRule);
  };

  const deleteRule = async (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    await syncEngine.syncDelete('rules', id);
  };

  const triggerRecovery = async (reason: string, protocolApplied: string, notes?: string) => {
    const id = 'rec-' + Date.now();
    const event: RecoveryEvent = {
      id,
      date: currentDateStr,
      triggerReason: reason,
      protocolApplied,
      notes,
      resolved: true,
      timestamp: new Date().toISOString(),
    };
    setRecoveryEvents((prev) => [...prev, event]);
    await syncEngine.syncUpsert('recoveryEvents', id, event);
  };

  const exportBackup = async (): Promise<string> => {
    const data = await db.exportAllData();
    const updatedSettings = { ...data.settings, lastBackupDate: new Date().toISOString() };
    await updateSettings(updatedSettings);

    const backupPayload: BackupData = {
      ...data,
      userAccount: user ? { uid: user.uid, email: user.email } : undefined,
    };
    return JSON.stringify(backupPayload, null, 2);
  };

  const postExportVerifiedDownload = async (): Promise<{ success: boolean; filename?: string; error?: string }> => {
    try {
      const data = await db.exportAllData();
      const backupPayload: BackupData = {
        ...data,
        userAccount: user ? { uid: user.uid, email: user.email } : undefined,
      };
      const jsonContent = JSON.stringify(backupPayload, null, 2);

      // Post-export verification
      const verifyParsed = JSON.parse(jsonContent) as BackupData;
      if (!verifyParsed || typeof verifyParsed.schemaVersion !== 'number') {
        throw new Error('Post-export verification failed: corrupt JSON structure.');
      }
      const requiredStores = ['days', 'habits', 'tasks', 'focusSessions', 'goals', 'bodyLogs', 'academicLogs', 'subjects', 'careerLogs', 'digitalLogs', 'journalEntries', 'weeklyReviews', 'rules', 'recoveryEvents'];
      for (const store of requiredStores) {
        if (!Array.isArray((verifyParsed as any)[store])) {
          throw new Error(`Post-export verification failed: missing store array "${store}".`);
        }
      }

      const filename = await db.generateBackupFilename();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const nowIso = new Date().toISOString();
      await updateSettings({ lastBackupDate: nowIso });

      return { success: true, filename };
    } catch (err: any) {
      console.error('Verified backup export failed:', err);
      return { success: false, error: err.message || 'Backup export failed.' };
    }
  };

  const importBackup = async (jsonContent: string, mode: 'replace' | 'merge'): Promise<{ success: boolean; error?: string }> => {
    try {
      const parsed = JSON.parse(jsonContent) as BackupData;
      const res = await db.importData(parsed, mode);
      if (res.success) {
        await loadData();
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || 'Corrupt or invalid backup format.' };
    }
  };

  const runIntegrityCheck = async (): Promise<db.DatabaseHealthReport> => {
    return db.runIntegrityCheck();
  };

  const resetAllAppData = async () => {
    await db.clearAllStores();
    await loadData();
  };

  const tasksForToday = allTasks.filter((t) => t.date === currentDateStr && !t.deletedAt);

  return (
    <AppContext.Provider
      value={{
        loading,
        user,
        isLocalMode: !user,
        syncStatus,
        pendingQueueCount,
        settings,
        todayLog,
        habits: habits.filter((h) => !h.deletedAt),
        tasks: tasksForToday,
        allTasks: allTasks.filter((t) => !t.deletedAt),
        focusSessions: focusSessions.filter((f) => !f.deletedAt),
        goals: goals.filter((g) => !g.deletedAt),
        bodyLogs: bodyLogs.filter((b) => !b.deletedAt),
        academicLogs: academicLogs.filter((a) => !a.deletedAt),
        subjects: subjects.filter((s) => !s.deletedAt),
        careerLogs: careerLogs.filter((c) => !c.deletedAt),
        digitalLogs: digitalLogs.filter((d) => !d.deletedAt),
        journalEntries: journalEntries.filter((j) => !j.deletedAt),
        weeklyReviews: weeklyReviews.filter((w) => !w.deletedAt),
        rules: rules.filter((r) => !r.deletedAt),
        recoveryEvents: recoveryEvents.filter((rc) => !rc.deletedAt),
        allDayLogs: allDayLogs.filter((dl) => !dl.deletedAt),

        currentDateStr,
        dayNumber,
        todayScore,
        scoreLabel,
        currentStreak,
        needsBackupReminder,

        signInWithGoogleProvider,
        signInWithEmailPass,
        signOut,

        updateSettings,
        toggleHabit,
        updateDayMissions,
        updateDayReflection,
        setNoZeroAction,
        addTask,
        toggleTask,
        deleteTask,
        addFocusSession,
        saveGoal,
        deleteGoal,
        saveBodyLog,
        saveAcademicLog,
        saveSubject,
        deleteSubject,
        saveCareerLog,
        saveDigitalLog,
        saveJournalEntry,
        saveWeeklyReview,
        addRule,
        deleteRule,
        triggerRecovery,
        exportBackup,
        postExportVerifiedDownload,
        importBackup,
        dismissBackupReminder,
        runIntegrityCheck,
        resetAllAppData,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
