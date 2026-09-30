export type ExerciseKind = 'strength' | 'bodyweight' | 'timed' | 'distance';

export interface Exercise {
  id: string;
  /** Null for the shared catalogue; the user's id for their own exercises. */
  ownerId: string | null;
  name: string;
  muscle: string;
  secondary: string;
  equipment: string;
  kind: ExerciseKind;
  initials: string;
  color: string;
}

export type ExerciseDraft = Pick<Exercise, 'name' | 'muscle' | 'equipment' | 'kind'>;

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  repRange: string;
  restSeconds: number;
  note?: string;
}

export interface RoutineDay {
  /** Missing for days created in the editor and not saved yet. */
  id?: string;
  name: string;
  exercises: RoutineExercise[];
}

export interface Routine {
  id: string;
  name: string;
  focus: string;
  /** Summary computed by the database, e.g. "Upper A" or "4 días". */
  daysLabel: string;
  duration: number;
  color: string;
  archivedAt: string | null;
  days: RoutineDay[];
}

export type RoutineDraft = Pick<Routine, 'name' | 'focus' | 'duration' | 'color' | 'days'>;

export interface WorkoutSet {
  id: string;
  weight: number | null;
  reps: number | null;
  target: string;
  completed: boolean;
}

export type SetValues = Pick<WorkoutSet, 'weight' | 'reps' | 'completed'>;

export interface SessionExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  note?: string;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineDayId?: string;
  dayName?: string;
  name: string;
  startedAt: string;
  finishedAt?: string;
  durationMinutes?: number;
  status: 'active' | 'completed';
  exercises: SessionExercise[];
}

/** A set change that could not be saved yet (e.g. offline). */
export interface PendingSetUpdate extends SetValues {
  sessionId: string;
  setId: string;
}

/** A set added while offline; it only has a local id until the server creates it. */
export interface LocalSet {
  localId: string;
  sessionExerciseId: string;
}

/** Everything needed to resume the workout (and its unsynced changes) after a reload. */
export interface WorkoutSnapshot {
  session: WorkoutSession | null;
  pendingSetUpdates: PendingSetUpdate[];
  localSets: LocalSet[];
  /** Id of a session finished while offline, waiting to be sent. */
  finishQueued: string | null;
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
}

export interface ProgressSummary {
  sessions: number;
  completedSets: number;
  volume: number;
  records: PersonalRecord[];
  /** Local dates (YYYY-MM-DD) with at least one finished workout. */
  trainingDays: string[];
  /** Last 8 weeks; weeks without training are missing. */
  weeklyVolume: { weekStart: string; volume: number }[];
}

export interface ExerciseProgressPoint {
  date: string;
  weight: number;
  reps: number;
}

export interface Profile {
  displayName: string | null;
  isAdmin: boolean;
}

export interface AppErrorLog {
  id: number;
  userId: string | null;
  severity: 'error' | 'warning' | 'info';
  source: string;
  message: string;
  route: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}
