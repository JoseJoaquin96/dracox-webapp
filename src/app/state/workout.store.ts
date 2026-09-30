import { Injectable, computed, inject, signal } from '@angular/core';
import { AppError, isOffline } from '../core/errors';
import { SyncStatus } from '../core/sync-status';
import { WorkoutApi } from '../data/workout.api';
import { LocalSet, PendingSetUpdate, SetValues, WorkoutSession, WorkoutSet, WorkoutSnapshot } from '../domain/models';
import { HistoryStore } from './history.store';
import { ProgressStore } from './progress.store';
import { RoutineStore } from './routine.store';

const TYPING_DEBOUNCE_MS = 600;
const LOCAL_ID_PREFIX = 'local-';

/**
 * The workout in progress. It keeps working offline:
 * - set values are applied locally at once and saved in the background (debounced while
 *   typing, one request at a time per set); failed saves wait in `pending`;
 * - sets added offline get a local id until the server creates them;
 * - finishing offline is queued and sent once everything else is saved.
 */
@Injectable({ providedIn: 'root' })
export class WorkoutStore {
  private readonly api = inject(WorkoutApi);
  private readonly status = inject(SyncStatus);
  private readonly history = inject(HistoryStore);
  private readonly progress = inject(ProgressStore);
  private readonly routines = inject(RoutineStore);

  private readonly session = signal<WorkoutSession | null>(null);
  private readonly pending = signal<PendingSetUpdate[]>([]);
  private readonly localSets = signal<LocalSet[]>([]);
  private readonly finishQueued = signal<string | null>(null);
  /** The workout in progress; hidden once finished, even while the finish waits to be sent. */
  readonly active = computed(() => {
    const session = this.session();
    return session && session.id !== this.finishQueued() ? session : null;
  });
  readonly unsyncedCount = computed(() => this.pending().length + this.localSets().length + (this.finishQueued() ? 1 : 0));
  readonly snapshot = computed<WorkoutSnapshot>(() => ({
    session: this.session(),
    pendingSetUpdates: this.pending(),
    localSets: this.localSets(),
    finishQueued: this.finishQueued()
  }));

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly queues = new Map<string, Promise<void>>();
  // Bumped on every local edit so a late server response never overwrites newer values.
  private readonly versions = new Map<string, number>();
  private syncing: Promise<void> | null = null;

  restore(snapshot: Partial<WorkoutSnapshot>): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.queues.clear();
    this.versions.clear();
    this.session.set(snapshot.session ?? null);
    this.pending.set(snapshot.pendingSetUpdates ?? []);
    this.localSets.set(snapshot.localSets ?? []);
    this.finishQueued.set(snapshot.finishQueued ?? null);
  }

  /** Sends offline changes, then reloads the active session from the server. */
  async load(): Promise<boolean> {
    await this.sync();
    // Keep the local copy while it has changes the server doesn't know about yet.
    if (this.unsyncedCount()) return false;
    return this.status.run(async () => this.session.set(await this.api.active()));
  }

  /** Sends everything done offline, in order: new sets, set values, then a queued finish. */
  sync(): Promise<void> {
    this.syncing ??= this.sendOfflineChanges().finally(() => (this.syncing = null));
    return this.syncing;
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

  async addSet(sessionExerciseId: string): Promise<void> {
    try {
      this.appendSet(sessionExerciseId, await this.api.addSet(sessionExerciseId));
    } catch (error) {
      if (!isOffline(error)) return this.status.report(error, 'workout-set');
      const localId = LOCAL_ID_PREFIX + crypto.randomUUID();
      const previous = this.session()?.exercises.find((exercise) => exercise.id === sessionExerciseId)?.sets.at(-1);
      this.appendSet(sessionExerciseId, { id: localId, weight: null, reps: null, target: previous?.target ?? '', completed: false });
      this.localSets.update((sets) => [...sets, { localId, sessionExerciseId }]);
    }
  }

  updateSet(setId: string, changes: Partial<SetValues>, delayMs = TYPING_DEBOUNCE_MS): void {
    if (!this.findSet(setId)) return;
    this.versions.set(setId, this.version(setId) + 1);
    this.patchSet(setId, changes);
    this.pending.update((updates) => updates.map((update) => update.setId === setId ? { ...update, ...changes } : update));
    // Local sets are sent with their latest values once the server creates them.
    if (!setId.startsWith(LOCAL_ID_PREFIX)) this.scheduleWrite(setId, delayMs);
  }

  toggleSet(setId: string): void {
    const set = this.findSet(setId);
    if (set) this.updateSet(setId, { completed: !set.completed }, 0);
  }

  /** Saves pending changes and refreshes the session from the server. */
  async save(): Promise<void> {
    await this.flushWrites();
    await this.load();
  }

  /** Finishes the workout (queued while offline). Resolves to false if the server rejected it. */
  async finish(): Promise<boolean> {
    const session = this.session();
    if (!session) return false;
    await this.flushWrites();
    this.finishQueued.set(session.id);
    this.history.addLocal({
      ...session,
      status: 'completed',
      finishedAt: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round((Date.now() - Date.parse(session.startedAt)) / 60000))
    });
    await this.sync();
    return this.finishQueued() === session.id || this.session() === null;
  }

  /**
   * For when the page is hidden (tab closed, app switched): edits still waiting for their
   * debounce are queued as pending, so they survive a reload, and are sent right away.
   */
  saveBeforeLeaving(): void {
    const session = this.session();
    if (!session || !this.timers.size) return;
    const unsent = [...this.timers.keys()].flatMap((setId) => {
      const set = this.findSet(setId);
      return set ? [{ sessionId: session.id, setId, weight: set.weight, reps: set.reps, completed: set.completed }] : [];
    });
    const unsentIds = new Set(unsent.map((update) => update.setId));
    this.pending.update((updates) => [...updates.filter((update) => !unsentIds.has(update.setId)), ...unsent]);
    void this.flushWrites();
  }

  private async sendOfflineChanges(): Promise<void> {
    if (!this.session()) return;
    await this.createLocalSets();
    await this.retryPending();
    await this.sendQueuedFinish();
  }

  private async createLocalSets(): Promise<void> {
    for (const local of this.localSets()) {
      try {
        const saved = await this.api.addSet(local.sessionExerciseId);
        this.replaceSetId(local.localId, saved.id);
        await this.enqueue(saved.id, () => this.writeLatest(saved.id));
      } catch (error) {
        if (isOffline(error)) return;
        // The server can't create it (e.g. the workout is no longer active): drop it.
        this.status.report(error, 'workout-set');
        this.session.update((session) => session && {
          ...session,
          exercises: session.exercises.map((exercise) => ({ ...exercise, sets: exercise.sets.filter((set) => set.id !== local.localId) }))
        });
      }
      this.localSets.update((sets) => sets.filter((item) => item.localId !== local.localId));
    }
  }

  private async retryPending(): Promise<void> {
    const session = this.session();
    if (!session) return;
    // Sets with a scheduled write will send their latest local values anyway.
    const updates = this.pending().filter((update) => update.sessionId === session.id && !this.timers.has(update.setId));
    await Promise.all(updates.map((update) => this.enqueue(update.setId, async () => {
      if (this.pending().includes(update)) await this.send(update);
    })));
    if (!this.pending().length) this.status.clearError();
  }

  private async sendQueuedFinish(): Promise<void> {
    const sessionId = this.finishQueued();
    if (!sessionId || this.pending().length || this.localSets().length) return;
    try {
      await this.api.finish(sessionId);
    } catch (error) {
      if (isOffline(error)) return;
      this.finishQueued.set(null);
      this.history.remove(sessionId);
      this.status.report(error, 'finish-workout');
      return;
    }
    this.restore({});
    await Promise.all([this.history.load(), this.progress.load()]);
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

  private appendSet(sessionExerciseId: string, set: WorkoutSet): void {
    this.session.update((session) => session && {
      ...session,
      exercises: session.exercises.map((exercise) => exercise.id === sessionExerciseId ? { ...exercise, sets: [...exercise.sets, set] } : exercise)
    });
  }

  private patchSet(setId: string, values: Partial<WorkoutSet>): void {
    this.session.update((session) => session && {
      ...session,
      exercises: session.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => set.id === setId ? { ...set, ...values } : set)
      }))
    });
  }

  private replaceSetId(localId: string, id: string): void {
    this.patchSet(localId, { id });
    this.versions.set(id, this.version(localId));
    this.versions.delete(localId);
  }

  private version(setId: string): number {
    return this.versions.get(setId) ?? 0;
  }
}
