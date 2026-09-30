import { Exercise, ProgressSummary, Routine, WorkoutSession, WorkoutSnapshot } from '../domain/models';

const PREFIX = 'dracox-cache:v2:';
const LEGACY_PREFIX = 'dracox-workout-cache:';

/** Last known data per user, so the app opens with content while offline. */
export interface CacheSnapshot {
  exercises: Exercise[];
  routines: Routine[];
  history: WorkoutSession[];
  progress: ProgressSummary;
  workout: WorkoutSnapshot;
}

export function readCache(userId: string): Partial<CacheSnapshot> {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + userId) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function writeCache(userId: string, snapshot: CacheSnapshot): void {
  try {
    localStorage.setItem(PREFIX + userId, JSON.stringify(snapshot));
  } catch {
    // Storage full or unavailable: the app keeps working without cache.
  }
}

export function removeCache(userId: string): void {
  try {
    localStorage.removeItem(PREFIX + userId);
  } catch {
    // Storage unavailable.
  }
}

/** Deletes caches written by the previous app version, which were never cleared on sign-out. */
export function removeLegacyCache(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(LEGACY_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable.
  }
}
