import {
  RoutineStore
} from "./chunk-GSW2JVWK.js";
import {
  HistoryStore,
  ProgressStore,
  WorkoutApi
} from "./chunk-UUWUQZ7C.js";
import {
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  AppError,
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  isOffline,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-2MVRL4DM.js";

// src/app/state/workout.store.ts
var TYPING_DEBOUNCE_MS = 600;
var LOCAL_ID_PREFIX = "local-";
var WorkoutStore = class _WorkoutStore {
  constructor() {
    this.api = inject(WorkoutApi);
    this.status = inject(SyncStatus);
    this.history = inject(HistoryStore);
    this.progress = inject(ProgressStore);
    this.routines = inject(RoutineStore);
    this.session = signal(null, ...ngDevMode ? [{ debugName: "session" }] : (
      /* istanbul ignore next */
      []
    ));
    this.pending = signal([], ...ngDevMode ? [{ debugName: "pending" }] : (
      /* istanbul ignore next */
      []
    ));
    this.localSets = signal([], ...ngDevMode ? [{ debugName: "localSets" }] : (
      /* istanbul ignore next */
      []
    ));
    this.finishQueued = signal(null, ...ngDevMode ? [{ debugName: "finishQueued" }] : (
      /* istanbul ignore next */
      []
    ));
    this.active = computed(() => {
      const session = this.session();
      return session && session.id !== this.finishQueued() ? session : null;
    }, ...ngDevMode ? [{ debugName: "active" }] : (
      /* istanbul ignore next */
      []
    ));
    this.unsyncedCount = computed(() => this.pending().length + this.localSets().length + (this.finishQueued() ? 1 : 0), ...ngDevMode ? [{ debugName: "unsyncedCount" }] : (
      /* istanbul ignore next */
      []
    ));
    this.snapshot = computed(() => ({
      session: this.session(),
      pendingSetUpdates: this.pending(),
      localSets: this.localSets(),
      finishQueued: this.finishQueued()
    }), ...ngDevMode ? [{ debugName: "snapshot" }] : (
      /* istanbul ignore next */
      []
    ));
    this.timers = /* @__PURE__ */ new Map();
    this.queues = /* @__PURE__ */ new Map();
    this.versions = /* @__PURE__ */ new Map();
    this.syncing = null;
  }
  restore(snapshot) {
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
  async load() {
    await this.sync();
    if (this.unsyncedCount())
      return false;
    return this.status.run(async () => this.session.set(await this.api.active()));
  }
  /** Sends everything done offline, in order: new sets, set values, then a queued finish. */
  sync() {
    this.syncing ??= this.sendOfflineChanges().finally(() => this.syncing = null);
    return this.syncing;
  }
  start(routineId, routineDayId) {
    return this.status.run(async () => {
      const routine = this.routines.byId(routineId);
      const day = routine?.days.find((item) => item.id === routineDayId) ?? routine?.days[0];
      if (!routine || routine.archivedAt || !day?.id)
        throw new AppError("Esta rutina no tiene ning\xFAn d\xEDa configurado.");
      const sessionId = await this.api.start(routineId, day.id);
      this.session.set(await this.api.active(sessionId));
    });
  }
  async addSet(sessionExerciseId) {
    try {
      this.appendSet(sessionExerciseId, await this.api.addSet(sessionExerciseId));
    } catch (error) {
      if (!isOffline(error))
        return this.status.report(error, "workout-set");
      const localId = LOCAL_ID_PREFIX + crypto.randomUUID();
      const previous = this.session()?.exercises.find((exercise) => exercise.id === sessionExerciseId)?.sets.at(-1);
      this.appendSet(sessionExerciseId, { id: localId, weight: null, reps: null, target: previous?.target ?? "", completed: false });
      this.localSets.update((sets) => [...sets, { localId, sessionExerciseId }]);
    }
  }
  updateSet(setId, changes, delayMs = TYPING_DEBOUNCE_MS) {
    if (!this.findSet(setId))
      return;
    this.versions.set(setId, this.version(setId) + 1);
    this.patchSet(setId, changes);
    this.pending.update((updates) => updates.map((update) => update.setId === setId ? __spreadValues(__spreadValues({}, update), changes) : update));
    if (!setId.startsWith(LOCAL_ID_PREFIX))
      this.scheduleWrite(setId, delayMs);
  }
  toggleSet(setId) {
    const set = this.findSet(setId);
    if (set)
      this.updateSet(setId, { completed: !set.completed }, 0);
  }
  /** Saves pending changes and refreshes the session from the server. */
  async save() {
    await this.flushWrites();
    await this.load();
  }
  /** Finishes the workout (queued while offline). Resolves to false if the server rejected it. */
  async finish() {
    const session = this.session();
    if (!session)
      return false;
    await this.flushWrites();
    this.finishQueued.set(session.id);
    this.history.addLocal(__spreadProps(__spreadValues({}, session), {
      status: "completed",
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      durationMinutes: Math.max(1, Math.round((Date.now() - Date.parse(session.startedAt)) / 6e4))
    }));
    await this.sync();
    return this.finishQueued() === session.id || this.session() === null;
  }
  /**
   * For when the page is hidden (tab closed, app switched): edits still waiting for their
   * debounce are queued as pending, so they survive a reload, and are sent right away.
   */
  saveBeforeLeaving() {
    const session = this.session();
    if (!session || !this.timers.size)
      return;
    const unsent = [...this.timers.keys()].flatMap((setId) => {
      const set = this.findSet(setId);
      return set ? [{ sessionId: session.id, setId, weight: set.weight, reps: set.reps, completed: set.completed }] : [];
    });
    const unsentIds = new Set(unsent.map((update) => update.setId));
    this.pending.update((updates) => [...updates.filter((update) => !unsentIds.has(update.setId)), ...unsent]);
    void this.flushWrites();
  }
  async sendOfflineChanges() {
    if (!this.session())
      return;
    await this.createLocalSets();
    await this.retryPending();
    await this.sendQueuedFinish();
  }
  async createLocalSets() {
    for (const local of this.localSets()) {
      try {
        const saved = await this.api.addSet(local.sessionExerciseId);
        this.replaceSetId(local.localId, saved.id);
        await this.enqueue(saved.id, () => this.writeLatest(saved.id));
      } catch (error) {
        if (isOffline(error))
          return;
        this.status.report(error, "workout-set");
        this.session.update((session) => session && __spreadProps(__spreadValues({}, session), {
          exercises: session.exercises.map((exercise) => __spreadProps(__spreadValues({}, exercise), { sets: exercise.sets.filter((set) => set.id !== local.localId) }))
        }));
      }
      this.localSets.update((sets) => sets.filter((item) => item.localId !== local.localId));
    }
  }
  async retryPending() {
    const session = this.session();
    if (!session)
      return;
    const updates = this.pending().filter((update) => update.sessionId === session.id && !this.timers.has(update.setId));
    await Promise.all(updates.map((update) => this.enqueue(update.setId, async () => {
      if (this.pending().includes(update))
        await this.send(update);
    })));
    if (!this.pending().length)
      this.status.clearError();
  }
  async sendQueuedFinish() {
    const sessionId = this.finishQueued();
    if (!sessionId || this.pending().length || this.localSets().length)
      return;
    try {
      await this.api.finish(sessionId);
    } catch (error) {
      if (isOffline(error))
        return;
      this.finishQueued.set(null);
      this.history.remove(sessionId);
      this.status.report(error, "finish-workout");
      return;
    }
    this.restore({});
    await Promise.all([this.history.load(), this.progress.load()]);
  }
  scheduleWrite(setId, delayMs) {
    clearTimeout(this.timers.get(setId));
    this.timers.set(setId, setTimeout(() => {
      this.timers.delete(setId);
      void this.enqueue(setId, () => this.writeLatest(setId));
    }, delayMs));
  }
  async flushWrites() {
    for (const [setId, timer] of this.timers) {
      clearTimeout(timer);
      void this.enqueue(setId, () => this.writeLatest(setId));
    }
    this.timers.clear();
    await Promise.all(this.queues.values());
  }
  // Writes for the same set run one after another, so the server always ends with the last value.
  enqueue(setId, task) {
    const next = (this.queues.get(setId) ?? Promise.resolve()).then(task).catch(() => void 0);
    this.queues.set(setId, next);
    return next;
  }
  async writeLatest(setId) {
    const session = this.session();
    const set = this.findSet(setId);
    if (!session || !set)
      return;
    const error = await this.send({ sessionId: session.id, setId, weight: set.weight, reps: set.reps, completed: set.completed });
    if (error)
      this.status.report(error, "workout-set");
  }
  /** Saves one update and resolves to the error, if any. */
  async send(update) {
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
      if (isLatest())
        this.pending.update((updates) => [...updates.filter((item) => item.setId !== update.setId), update]);
      return error;
    }
  }
  findSet(setId) {
    return this.session()?.exercises.flatMap((exercise) => exercise.sets).find((set) => set.id === setId);
  }
  appendSet(sessionExerciseId, set) {
    this.session.update((session) => session && __spreadProps(__spreadValues({}, session), {
      exercises: session.exercises.map((exercise) => exercise.id === sessionExerciseId ? __spreadProps(__spreadValues({}, exercise), { sets: [...exercise.sets, set] }) : exercise)
    }));
  }
  patchSet(setId, values) {
    this.session.update((session) => session && __spreadProps(__spreadValues({}, session), {
      exercises: session.exercises.map((exercise) => __spreadProps(__spreadValues({}, exercise), {
        sets: exercise.sets.map((set) => set.id === setId ? __spreadValues(__spreadValues({}, set), values) : set)
      }))
    }));
  }
  replaceSetId(localId, id) {
    this.patchSet(localId, { id });
    this.versions.set(id, this.version(localId));
    this.versions.delete(localId);
  }
  version(setId) {
    return this.versions.get(setId) ?? 0;
  }
  static {
    this.\u0275fac = function WorkoutStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutStore)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WorkoutStore, factory: _WorkoutStore.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkoutStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  WorkoutStore
};
//# sourceMappingURL=chunk-BN2ML33X.js.map
