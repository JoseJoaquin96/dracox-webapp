import { Exercise, PendingSetUpdate, Routine, WorkoutSession } from '../domain/models';

const PREFIX = 'dracox-cache:v2:';

/** Last known data per user, so the app opens with content while offline. */
export interface CacheSnapshot {
  exercises: Exercise[];
  routines: Routine[];
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
  pendingSetUpdates: PendingSetUpdate[];
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
