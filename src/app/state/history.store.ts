import { Injectable, inject, signal } from '@angular/core';
import { SyncStatus } from '../core/sync-status';
import { WorkoutApi } from '../data/workout.api';
import { WorkoutSession } from '../domain/models';

const PAGE_SIZE = 50;

/** Finished workouts, newest first, loaded one page at a time. */
@Injectable({ providedIn: 'root' })
export class HistoryStore {
  private readonly api = inject(WorkoutApi);
  private readonly status = inject(SyncStatus);
  private readonly state = signal<WorkoutSession[]>([]);
  private readonly more = signal(false);
  readonly sessions = this.state.asReadonly();
  readonly hasMore = this.more.asReadonly();

  restore(sessions: WorkoutSession[]): void {
    this.state.set(sessions);
    this.more.set(false);
  }

  /** Reloads the most recent page. */
  load(): Promise<boolean> {
    return this.status.run(async () => {
      const page = await this.api.history(PAGE_SIZE);
      this.state.set(page);
      this.more.set(page.length === PAGE_SIZE);
    });
  }

  loadMore(): Promise<boolean> {
    const oldest = this.state().at(-1);
    if (!oldest) return this.load();
    return this.status.run(async () => {
      const page = await this.api.history(PAGE_SIZE, oldest.startedAt);
      this.state.update((sessions) => [...sessions, ...page]);
      this.more.set(page.length === PAGE_SIZE);
    });
  }

  /** Shows a workout finished offline until the server confirms it. */
  addLocal(session: WorkoutSession): void {
    this.state.update((sessions) => [session, ...sessions.filter((item) => item.id !== session.id)]);
  }

  remove(sessionId: string): void {
    this.state.update((sessions) => sessions.filter((session) => session.id !== sessionId));
  }
}
