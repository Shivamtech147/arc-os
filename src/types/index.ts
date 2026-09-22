export type CategoryType = 'Body' | 'Academics' | 'Career' | 'Mind' | 'Digital' | 'Personal';

export type PriorityType = 'low' | 'medium' | 'high';

export type ScoreCategory = 'body' | 'academics' | 'career' | 'mind' | 'sleep' | 'digital';

export type SyncStatusState = 'synced' | 'syncing' | 'saving' | 'offline' | 'error';

export interface BaseSyncEntity {
  id?: string;
  userId?: string;
  createdAt?: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  deletedAt?: string | null; // ISO datetime for soft deletes / tombstones
  version?: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export interface UserSettings extends BaseSyncEntity {
  userName: string;
  startDate: string; // ISO string YYYY-MM-DD
  totalDays: number; // Default 90
  wakeTime: string; // e.g. "06:00"
  sleepTargetHours: number; // e.g. 8
  studyTargetHours: number; // e.g. 4
  careerTargetHours: number; // e.g. 3
  gymTargetSessions: number; // e.g. 5 per week
  coreScoreCategories: ScoreCategory[];
  onboardingCompleted: boolean;
  lastBackupDate: string | null;
  schemaVersion: number;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

export interface DayReflection {
  win?: string;
  mistake?: string;
  timeWasted?: string;
  lesson?: string;
  tomorrowMission?: string;
}

export interface DayLog extends BaseSyncEntity {
  date: string; // YYYY-MM-DD (Primary Key)
  dayNumber: number; // 1 to 90
  score: number; // 0 to 6
  habitsCompleted: Record<string, boolean>; // habitId -> boolean
  mainMission: string;
  academicMission?: string;
  careerMission?: string;
  bodyMission?: string;
  reflection?: DayReflection;
  noZeroAction?: string;
}

export interface Habit extends BaseSyncEntity {
  id: string;
  title: string;
  category: ScoreCategory;
  isCore: boolean;
  minimumVersion: string;
  consecutiveMisses: number;
  lastLoggedDate: string | null; // YYYY-MM-DD
}

export interface Task extends BaseSyncEntity {
  id: string;
  title: string;
  category: CategoryType;
  priority: PriorityType;
  estimatedDurationMinutes: number;
  deadline: string | null; // HH:mm or datetime
  completed: boolean;
  completedAt: string | null;
  date: string; // YYYY-MM-DD
}

export interface FocusSession extends BaseSyncEntity {
  id: string;
  mission: string;
  durationMinutes: number;
  actualMinutes: number;
  status: 'completed' | 'partially_completed' | 'abandoned';
  abandonedReason?: string | null;
  timestamp: string; // ISO Datetime
  date: string; // YYYY-MM-DD
}

export interface Goal extends BaseSyncEntity {
  id: string;
  category: 'Body' | 'Academics' | 'Career' | 'Mind';
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  metric: string; // e.g. "Weight (kg)", "DSA Solved", "Deep Work Hours"
  target: number;
  currentValue: number;
  status: 'Not Started' | 'In Progress' | 'Achieved' | 'At Risk';
}

export interface BodyLog extends BaseSyncEntity {
  date: string; // YYYY-MM-DD
  weightKg?: number;
  gymCompleted: boolean;
  stepsCount?: number;
  sleepHours?: number;
  proteinGrams?: number;
  waterLiters?: number;
  notes?: string;
}

export interface AcademicLog extends BaseSyncEntity {
  date: string; // YYYY-MM-DD
  studyHours: number;
  deepWorkHours: number;
  revisionHours: number;
  subjectLogs?: Record<string, number>; // subjectId -> hours
  notes?: string;
}

export interface AcademicSubject extends BaseSyncEntity {
  id: string;
  name: string;
  targetHoursPerWeek: number;
  upcomingExamDate?: string;
}

export interface CareerLog extends BaseSyncEntity {
  date: string; // YYYY-MM-DD
  dsaProblemsCount: number;
  codingHours: number;
  mlHours: number;
  applicationsSubmitted: number;
  notes?: string;
}

export interface DigitalLog extends BaseSyncEntity {
  date: string; // YYYY-MM-DD
  instagramMinutes: number;
  youtubeMinutes: number;
  totalScreenTimeMinutes: number;
  pornFree: boolean;
  unplannedScrollingCount: number;
}

export interface JournalEntry extends BaseSyncEntity {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'morning' | 'evening';
  morningData?: {
    mainMission: string;
    behaviorTarget: string;
    potentialDerailers: string;
  };
  eveningData?: {
    win: string;
    mistake: string;
    timeWasted: string;
    lesson: string;
    tomorrowMission: string;
  };
}

export interface WeeklyReview extends BaseSyncEntity {
  id: string;
  weekNumber: number; // 1 to 13
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  averageScore: number;
  totalDeepWorkHours: number;
  totalWorkouts: number;
  sleepAverage: number;
  digitalDisciplineAvg: number;
  focusSessionsCount: number;
  responses: {
    improved: string;
    wentWrong: string;
    cause: string;
    remove: string;
    increase: string;
    nextWeekPriority: string;
  };
  savedAt: string;
}

export interface ArcRule extends BaseSyncEntity {
  id: string;
  title: string;
  description: string;
  isDefault: boolean;
}

export interface RecoveryEvent extends BaseSyncEntity {
  id: string;
  date: string; // YYYY-MM-DD
  triggerReason: string; // e.g., "Missed gym twice", "Lost the morning"
  protocolApplied: string;
  notes?: string;
  resolved: boolean;
  timestamp: string;
}

export interface SyncQueueItem {
  id: string; // auto id
  collectionName: string; // e.g. 'tasks', 'days', etc.
  docId: string;
  action: 'upsert' | 'delete';
  payload: any;
  timestamp: string;
}

export interface BackupData {
  schemaVersion: number;
  appVersion: string;
  exportDate: string;
  userAccount?: {
    uid: string;
    email: string | null;
  };
  settings: UserSettings;
  days: DayLog[];
  habits: Habit[];
  tasks: Task[];
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
  syncQueue?: SyncQueueItem[];
}
