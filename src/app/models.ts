export type ExerciseKind = 'strength' | 'bodyweight' | 'timed' | 'distance';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  secondary: string;
  equipment: string;
  kind: ExerciseKind;
  initials: string;
  color: string;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  repRange: string;
  restSeconds: number;
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  focus: string;
  days: string;
  duration: number;
  color: string;
  exercises: RoutineExercise[];
}

export interface WorkoutSet {
  id: string;
  weight: number | null;
  reps: number | null;
  target: string;
  completed: boolean;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  note?: string;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  name: string;
  startedAt: string;
  finishedAt?: string;
  durationMinutes?: number;
  status: 'active' | 'completed';
  exercises: SessionExercise[];
}
