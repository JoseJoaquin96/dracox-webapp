import { Injectable, inject, signal } from '@angular/core';
import { AppError } from '../core/errors';
import { SyncStatus } from '../core/sync-status';
import { WorkoutApi } from '../data/workout.api';
import { PendingSetUpdate, SetValues, WorkoutSession, WorkoutSet } from '../domain/models';
import { HistoryStore } from './history.store';
import { RoutineStore } from './routine.store';

const TYPING_DEBOUNCE_MS = 600;

/**
 * The workout in progress. Set changes are applied locally at once and saved in the
 * background: debounced while typing, one request at a time per set, and kept in
 * `pendingUpdates` when they fail so they can be retried later.
 */
@Injectable({ providedIn: 'root' })
export class WorkoutStore {
  private readonly api = inject(WorkoutApi);
  private readonly status = inject(SyncStatus);
  private readonly history = inject(HistoryStore);
  private readonly routines = inject(RoutineStore);
  private readonly session = signal<WorkoutSession | null>(null);
  private readonly pending = signal<PendingSetUpdate[]>([]);
  readonly active = this.session.asReadonly();
  readonly pendingUpdates = this.pending.asReadonly();

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly queues = new Map<string, Promise<void>>();
  // Bumped on every local edit so a late server response never overwrites newer values.
  private readonly versions = new Map<string, number>();

  restore(session: WorkoutSession | null, pending: PendingSetUpdate[]): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.queues.clear();
    this.versions.clear();
    this.session.set(session);
    this.pending.set(pending);
  }

  load(): Promise<boolean> {
    return this.status.run(async () => this.session.set(await this.api.active()));
  }

  start(routineId: string, routineDayId?: string): Promise<boolean> {
    return this.status.run(async () => {
      const routine = this.routines.byId(routineId);
      const day = routine?.days.find((item) => item.id === routineDayId) ?? routine?.days[0];
      if (!routine || routine.archivedAt || !day?.id) throw new AppError('Esta rutina no tiene ningún día configurado.');
      const sessionId = await this.api.start(routineId, day.id);
      this.session.set(await this.api.active(sessionId));
    });
  }

  addSet(sessionExerciseId: string): Promise<boolean> {
    return this.status.run(async () => {
      const set = await this.api.addSet(sessionExerciseId);
      this.session.update((session) => session && {
        ...session,
        exercises: session.exercises.map((exercise) => exercise.id === sessionExerciseId ? { ...exercise, sets: [...exercise.sets, set] } : exercise)
      });
    });
  }

  updateSet(setId: string, changes: Partial<SetValues>, delayMs = TYPING_DEBOUNCE_MS): void {
    if (!this.findSet(setId)) return;
    this.versions.set(setId, this.version(setId) + 1);
    this.patchSet(setId, changes);
    this.pending.update((updates) => updates.map((update) => update.setId === setId ? { ...update, ...changes } : update));
    this.scheduleWrite(setId, delayMs);
  }

  toggleSet(setId: string): void {
    const set = this.findSet(setId);
    if (set) this.updateSet(setId, { completed: !set.completed }, 0);
  }

  async save(): Promise<boolean> {
    const session = this.session();
    if (!session) return false;
    await this.flushWrites();
    await this.retryPending();
    return this.status.run(async () => this.session.set(await this.api.active(session.id)));
  }

  async finish(): Promise<boolean> {
    const session = this.session();
    if (!session) return false;
    await this.flushWrites();
    await this.retryPending();
    const finished = await this.status.run(async () => {
      if (this.pending().length) throw new AppError('Hay cambios pendientes de sincronizar. Recupera la conexión e inténtalo de nuevo.');
      await this.api.finish(session.id);
      this.restore(null, []);
    });
    if (finished) await this.history.load();
    return finished;
  }

  async retryPending(): Promise<void> {
    const session = this.session();
    if (!session) return;
    // Sets with a scheduled write will send their latest local values anyway.
    const updates = this.pending().filter((update) => update.sessionId === session.id && !this.timers.has(update.setId));
    await Promise.all(updates.map((update) => this.enqueue(update.setId, async () => {
      if (this.pending().includes(update)) await this.send(update);
    })));
    if (!this.pending().length) this.status.clearError();
  }

  private scheduleWrite(setId: string, delayMs: number): void {
    clearTimeout(this.timers.get(setId));
    this.timers.set(setId, setTimeout(() => {
      this.timers.delete(setId);
      void this.enqueue(setId, () => this.writeLatest(setId));
    }, delayMs));
  }

  private async flushWrites(): Promise<void> {
    for (const [setId, timer] of this.timers) {
      clearTimeout(timer);
      void this.enqueue(setId, () => this.writeLatest(setId));
    }
    this.timers.clear();
    await Promise.all(this.queues.values());
  }

  // Writes for the same set run one after another, so the server always ends with the last value.
  private enqueue(setId: string, task: () => Promise<void>): Promise<void> {
    const next = (this.queues.get(setId) ?? Promise.resolve()).then(task).catch(() => undefined);
    this.queues.set(setId, next);
    return next;
  }

  private async writeLatest(setId: string): Promise<void> {
    const session = this.session();
    const set = this.findSet(setId);
    if (!session || !set) return;
    const error = await this.send({ sessionId: session.id, setId, weight: set.weight, reps: set.reps, completed: set.completed });
    if (error) this.status.report(error, 'workout-set');
  }

  /** Saves one update and resolves to the error, if any. */
  private async send(update: PendingSetUpdate): Promise<unknown> {
    const version = this.version(update.setId);
    const isLatest = () => this.version(update.setId) === version;
    try {
      const saved = await this.api.updateSet(update);
      if (isLatest()) {
        this.patchSet(update.setId, saved);
        this.pending.update((updates) => updates.filter((item) => item.setId !== update.setId));
      }
      return null;
    } catch (error) {
      if (isLatest()) this.pending.update((updates) => [...updates.filter((item) => item.setId !== update.setId), update]);
      return error;
    }
  }

  private findSet(setId: string): WorkoutSet | undefined {
    return this.session()?.exercises.flatMap((exercise) => exercise.sets).find((set) => set.id === setId);
  }

  private patchSet(setId: string, values: Partial<SetValues>): void {
    this.session.update((session) => session && {
      ...session,
      exercises: session.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => set.id === setId ? { ...set, ...values } : set)
      }))
    });
  }

  private version(setId: string): number {
    return this.versions.get(setId) ?? 0;
  }
}
