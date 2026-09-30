import { Injectable, effect, inject, untracked } from '@angular/core';
import { AuthStore } from '../core/auth/auth.store';
import { CacheSnapshot, readCache, removeCache, removeLegacyCache, writeCache } from '../core/local-cache';
import { ExerciseStore } from './exercise.store';
import { HistoryStore } from './history.store';
import { ProgressStore } from './progress.store';
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
  private readonly progress = inject(ProgressStore);
  private readonly workout = inject(WorkoutStore);
  private cachedUserId: string | null = null;

  constructor() {
    removeLegacyCache();

    effect(() => {
      const userId = this.auth.userId();
      untracked(() => this.switchUser(userId));
    });

    effect(() => {
      const snapshot = this.snapshot();
      if (this.cachedUserId) writeCache(this.cachedUserId, snapshot);
    });

    window.addEventListener('online', () => void this.workout.sync());
    // The page may be closed right after this, so the cache is written synchronously.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'hidden' || !this.cachedUserId) return;
      this.workout.saveBeforeLeaving();
      writeCache(this.cachedUserId, this.snapshot());
    });
  }

  private snapshot(): CacheSnapshot {
    return {
      exercises: this.exercises.all(),
      routines: this.routines.all(),
      history: this.history.sessions(),
      progress: this.progress.summary(),
      workout: this.workout.snapshot()
    };
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
    this.progress.restore(cache.progress);
    this.workout.restore(cache.workout ?? {});

    if (!userId) return;
    this.cachedUserId = userId;
    void Promise.all([this.exercises.load(), this.routines.load(), this.history.load(), this.progress.load(), this.workout.load()]);
  }
}
