import { WorkoutSession } from './models';

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function sessionTimestamp(session: WorkoutSession): string {
  return session.finishedAt ?? session.startedAt;
}

// Local calendar day, so a 00:30 workout in Spain is not counted as the previous (UTC) day.
export function localDayKey(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
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

export function sessionVolume(session: WorkoutSession): number {
  return session.exercises
    .flatMap((exercise) => exercise.sets)
    .reduce((sum, set) => set.completed && set.weight !== null && set.reps !== null ? sum + set.weight * set.reps : sum, 0);
}

export function completedSetCount(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0);
}

// Consecutive days with a workout, ending today or yesterday (today may still be pending).
export function currentStreak(sessions: WorkoutSession[], now: Date): number {
  const days = new Set(sessions.map((session) => localDayKey(sessionTimestamp(session))));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(localDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface DayActivity {
  label: string;
  sessions: number;
  volume: number;
  minutes: number;
  isToday: boolean;
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

export interface MuscleSets {
  muscle: string;
  sets: number;
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

// Completed sets of the most recent finished session that included the exercise, e.g. "80 kg × 8 · 80 kg × 7".
export function lastPerformance(sessions: WorkoutSession[], exerciseId: string, excludeSessionId?: string): string | null {
  const ordered = [...sessions]
    .filter((session) => session.status === 'completed' && session.id !== excludeSessionId)
    .sort((a, b) => sessionTimestamp(b).localeCompare(sessionTimestamp(a)));
  for (const session of ordered) {
    const sets = session.exercises
      .filter((exercise) => exercise.exerciseId === exerciseId)
      .flatMap((exercise) => exercise.sets)
      .filter((set) => set.completed && (set.weight !== null || set.reps !== null));
    if (sets.length) {
      return sets.map((set) => `${set.weight ?? 0} kg × ${set.reps ?? 0}`).join(' · ');
    }
  }
  return null;
}
