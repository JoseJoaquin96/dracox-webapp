import { ExerciseKind, ProgressSummary, Routine, RoutineExercise, WorkoutSession, WorkoutSet } from './models';

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Column labels for a set; `weight: null` means the kind doesn't record weight. */
export const SET_FIELDS: Record<ExerciseKind, { weight: string | null; reps: string }> = {
  strength: { weight: 'Peso', reps: 'Reps' },
  bodyweight: { weight: 'Lastre', reps: 'Reps' },
  timed: { weight: null, reps: 'Seg' },
  distance: { weight: null, reps: 'Metros' }
};

export interface DayActivity {
  label: string;
  sessions: number;
  volume: number;
  minutes: number;
  isToday: boolean;
}

export interface MuscleSets {
  muscle: string;
  sets: number;
}

export interface CalendarDay {
  label: number;
  inMonth: boolean;
  trained: boolean;
}

export interface WeekVolume {
  label: string;
  volume: number;
  isCurrent: boolean;
}

export function routineExercises(routine: Routine): RoutineExercise[] {
  return routine.days.flatMap((day) => day.exercises);
}

export function plannedSets(routine: Routine): number {
  return routineExercises(routine).reduce((sum, exercise) => sum + exercise.sets, 0);
}

export function sessionTimestamp(session: WorkoutSession): string {
  return session.finishedAt ?? session.startedAt;
}

// Local calendar day, so a 00:30 workout in Spain is not counted as the previous (UTC) day.
export function localDayKey(value: string | Date): string {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function startOfWeek(now: Date): Date {
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function sessionsSince(sessions: WorkoutSession[], since: Date): WorkoutSession[] {
  return sessions.filter((session) => new Date(sessionTimestamp(session)) >= since);
}

/** Kg lifted: weight × reps of completed sets. Sets without weight (timed, distance) don't count. */
export function sessionVolume(session: WorkoutSession): number {
  return session.exercises
    .flatMap((exercise) => exercise.sets)
    .reduce((sum, set) => set.completed && set.weight !== null && set.reps !== null ? sum + set.weight * set.reps : sum, 0);
}

/** Epley formula. */
export function estimatedOneRepMax(weight: number, reps: number): number {
  return reps <= 1 ? weight : Math.round(weight * (1 + reps / 30));
}

// Consecutive days with a workout, ending today or yesterday (today may still be pending).
export function currentStreak(trainingDays: Iterable<string>, now: Date): number {
  const days = new Set(trainingDays);
  const cursor = new Date(now);
  if (!days.has(localDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function weekActivity(sessions: WorkoutSession[], now: Date): DayActivity[] {
  const monday = startOfWeek(now);
  const todayKey = localDayKey(now);
  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = localDayKey(date);
    const daySessions = sessions.filter((session) => localDayKey(sessionTimestamp(session)) === key);
    return {
      label,
      sessions: daySessions.length,
      volume: daySessions.reduce((sum, session) => sum + sessionVolume(session), 0),
      minutes: daySessions.reduce((sum, session) => sum + (session.durationMinutes ?? 0), 0),
      isToday: key === todayKey
    };
  });
}

export function muscleDistribution(sessions: WorkoutSession[], muscleOf: (exerciseId: string) => string | undefined): MuscleSets[] {
  const totals = new Map<string, number>();
  for (const session of sessions) {
    for (const exercise of session.exercises) {
      const completed = exercise.sets.filter((set) => set.completed).length;
      if (!completed) continue;
      const muscle = muscleOf(exercise.exerciseId) ?? 'Otros';
      totals.set(muscle, (totals.get(muscle) ?? 0) + completed);
    }
  }
  return Array.from(totals, ([muscle, sets]) => ({ muscle, sets })).sort((a, b) => b.sets - a.sets);
}

/** Full weeks (Monday first) covering the month of `now`. */
export function monthCalendar(trainingDays: Iterable<string>, now: Date): CalendarDay[] {
  const year = now.getFullYear();
  const month = now.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const trained = new Set(trainingDays);
  return Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, index) => {
    const date = new Date(year, month, index - offset + 1);
    const inMonth = date.getMonth() === month;
    return { label: date.getDate(), inMonth, trained: inMonth && trained.has(localDayKey(date)) };
  });
}

/** The last 8 weeks, oldest first, including weeks without training. */
export function lastWeeksVolume(weeklyVolume: ProgressSummary['weeklyVolume'], now: Date): WeekVolume[] {
  const byWeek = new Map(weeklyVolume.map((week) => [week.weekStart, week.volume]));
  const monday = startOfWeek(now);
  return Array.from({ length: 8 }, (_, index) => {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() - (7 - index) * 7);
    const key = localDayKey(weekStart);
    return { label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`, volume: byWeek.get(key) ?? 0, isCurrent: index === 7 };
  });
}

/** "80 kg × 8", "45 s", "400 m"… depending on the exercise kind. */
export function formatSetResult(set: Pick<WorkoutSet, 'weight' | 'reps'>, kind: ExerciseKind = 'strength'): string {
  if (kind === 'timed') return `${set.reps ?? 0} s`;
  if (kind === 'distance') return `${set.reps ?? 0} m`;
  if (kind === 'bodyweight' && !set.weight) return `${set.reps ?? 0} reps`;
  return `${set.weight ?? 0} kg × ${set.reps ?? 0}`;
}

/** Completed sets of the most recent finished session that included the exercise. */
export function lastPerformance(sessions: WorkoutSession[], exerciseId: string, kind: ExerciseKind = 'strength'): string | null {
  const ordered = sessions
    .filter((session) => session.status === 'completed')
    .sort((a, b) => sessionTimestamp(b).localeCompare(sessionTimestamp(a)));
  for (const session of ordered) {
    const sets = session.exercises
      .filter((exercise) => exercise.exerciseId === exerciseId)
      .flatMap((exercise) => exercise.sets)
      .filter((set) => set.completed && (set.weight !== null || set.reps !== null));
    if (sets.length) return sets.map((set) => formatSetResult(set, kind)).join(' · ');
  }
  return null;
}
