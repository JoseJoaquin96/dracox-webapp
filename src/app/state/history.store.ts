import { Injectable, inject, signal } from '@angular/core';
import { SyncStatus } from '../core/sync-status';
import { WorkoutApi } from '../data/workout.api';
import { WorkoutSession } from '../domain/models';

/** Finished workouts, newest first. */
@Injectable({ providedIn: 'root' })
export class HistoryStore {
  private readonly api = inject(WorkoutApi);
  private readonly status = inject(SyncStatus);
  private readonly state = signal<WorkoutSession[]>([]);
  readonly sessions = this.state.asReadonly();

  restore(sessions: WorkoutSession[]): void {
    this.state.set(sessions);
  }

  load(): Promise<boolean> {
    return this.status.run(async () => {
      const sessions = await this.api.history();
      this.state.set(sessions.filter((session) => session.status === 'completed'));
    });
  }
}
