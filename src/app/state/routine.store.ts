import { Injectable, computed, inject, signal } from '@angular/core';
import { SyncStatus } from '../core/sync-status';
import { RoutineApi } from '../data/routine.api';
import { Routine, RoutineDraft } from '../domain/models';

@Injectable({ providedIn: 'root' })
export class RoutineStore {
  private readonly api = inject(RoutineApi);
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
    return this.status.run(async () => this.state.set(await this.api.list()));
  }

  create(draft: RoutineDraft): Promise<boolean> {
    return this.status.run(async () => {
      await this.api.create(draft);
      this.state.set(await this.api.list());
    });
  }

  update(id: string, draft: RoutineDraft): Promise<boolean> {
    return this.status.run(async () => {
      await this.api.update(id, draft);
      this.state.set(await this.api.list());
    });
  }

  setArchived(id: string, archived: boolean): Promise<boolean> {
    return this.status.run(async () => {
      await this.api.setArchived(id, archived);
      const archivedAt = archived ? new Date().toISOString() : null;
      this.state.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt } : routine));
    });
  }
}
