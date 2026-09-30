import { Injectable, effect, inject, untracked } from '@angular/core';
import { AuthStore } from '../core/auth/auth.store';
import { readCache, removeCache, writeCache } from '../core/local-cache';
import { ExerciseStore } from './exercise.store';
import { HistoryStore } from './history.store';
import { RoutineStore } from './routine.store';
import { WorkoutStore } from './workout.store';

/**
 * Keeps the data stores in step with the signed-in user: restores the local cache and
 * reloads from Supabase on sign-in, clears everything on sign-out and keeps the cache updated.
 */
@Injectable({ providedIn: 'root' })
export class DataSync {
  private readonly auth = inject(AuthStore);
  private readonly exercises = inject(ExerciseStore);
  private readonly routines = inject(RoutineStore);
  private readonly history = inject(HistoryStore);
  private readonly workout = inject(WorkoutStore);
  private cachedUserId: string | null = null;

  constructor() {
    effect(() => {
      const userId = this.auth.userId();
      untracked(() => this.switchUser(userId));
    });

    effect(() => {
      const snapshot = {
        exercises: this.exercises.all(),
        routines: this.routines.all(),
        history: this.history.sessions(),
        activeSession: this.workout.active(),
        pendingSetUpdates: this.workout.pendingUpdates()
      };
      if (this.cachedUserId) writeCache(this.cachedUserId, snapshot);
    });

    window.addEventListener('online', () => void this.workout.retryPending());
  }

  private switchUser(userId: string | null): void {
    if (userId === this.cachedUserId) return;
    // Signing out (not switching accounts) wipes the data from this device.
    if (this.cachedUserId && !userId) removeCache(this.cachedUserId);
    this.cachedUserId = null;

    const cache = userId ? readCache(userId) : {};
    this.exercises.restore(cache.exercises ?? []);
    this.routines.restore(cache.routines ?? []);
    this.history.restore(cache.history ?? []);
    this.workout.restore(cache.activeSession ?? null, cache.pendingSetUpdates ?? []);

    if (!userId) return;
    this.cachedUserId = userId;
    void this.reload();
  }

  private async reload(): Promise<void> {
    await Promise.all([this.exercises.load(), this.routines.load(), this.history.load(), this.workout.load()]);
    await this.workout.retryPending();
  }
}
