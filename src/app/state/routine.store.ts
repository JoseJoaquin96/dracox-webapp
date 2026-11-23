import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../core/auth/auth.store';
import { SyncStatus } from '../core/sync-status';
import { RoutineApi } from '../data/routine.api';
import { Routine, RoutineDraft } from '../domain/models';

@Injectable({ providedIn: 'root' })
export class RoutineStore {
  private readonly api = inject(RoutineApi);
  private readonly auth = inject(AuthStore);
  private readonly status = inject(SyncStatus);
  private readonly state = signal<Routine[]>([]);
  private readonly index = computed(() => new Map(this.state().map((routine) => [routine.id, routine])));
  readonly active = computed(() => this.state().filter((routine) => !routine.archivedAt));
  readonly archived = computed(() => this.state().filter((routine) => routine.archivedAt));
  readonly all = this.state.asReadonly();

  byId(id: string): Routine | undefined {
    return this.index().get(id);
  }

  restore(routines: Routine[]): void {
    this.state.set(routines);
  }

  load(): Promise<boolean> {
    return this.status.run(() => this.reload(this.auth.userId()));
  }

  create(draft: RoutineDraft): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      await this.api.create(draft);
      await this.reload(userId);
    });
  }

  update(id: string, draft: RoutineDraft): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      await this.api.update(id, draft);
      await this.reload(userId);
    });
  }

  setArchived(id: string, archived: boolean): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      await this.api.setArchived(id, archived);
      if (this.auth.userId() !== userId) return;
      const archivedAt = archived ? new Date().toISOString() : null;
      this.state.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt } : routine));
    });
  }

  private async reload(userId: string | null): Promise<void> {
    if (!userId || this.auth.userId() !== userId) return;
    const routines = await this.api.list(userId);
    if (this.auth.userId() === userId) this.state.set(routines);
  }
}
