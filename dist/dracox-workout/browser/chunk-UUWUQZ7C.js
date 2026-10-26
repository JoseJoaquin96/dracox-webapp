import {
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  signal,
  supabase,
  unwrap,
  ɵɵdefineInjectable
} from "./chunk-2MVRL4DM.js";

// src/app/data/workout.api.ts
var WorkoutApi = class _WorkoutApi {
  /** Completed sessions started before `before` (or the latest ones), newest first. */
  async history(limit, before = null) {
    const rows = unwrap(await supabase().rpc("get_my_workout_history", { p_limit: limit, p_before: before }));
    return (rows ?? []).map(toSession);
  }
  async active(sessionId = null) {
    const row = unwrap(await supabase().rpc("get_my_active_workout", { p_session_id: sessionId }));
    return row ? toSession(row) : null;
  }
  /** Returns the id of the new (or already active) session. */
  async start(routineId, routineDayId) {
    return unwrap(await supabase().rpc("start_workout", { p_routine_id: routineId, p_routine_day_id: routineDayId }));
  }
  async addSet(sessionExerciseId) {
    return toSet(unwrap(await supabase().rpc("add_workout_set", { p_session_exercise_id: sessionExerciseId })));
  }
  async updateSet(update) {
    return toSet(unwrap(await supabase().rpc("update_workout_set", {
      p_set_id: update.setId,
      p_weight: update.weight,
      p_reps: update.reps,
      p_completed: update.completed
    })));
  }
  async finish(sessionId) {
    unwrap(await supabase().rpc("finish_workout", { p_session_id: sessionId }));
  }
  static {
    this.\u0275fac = function WorkoutApi_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutApi)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WorkoutApi, factory: _WorkoutApi.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkoutApi, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();
function toSet(row) {
  return { id: row.id, weight: row.weight, reps: row.reps, target: row.target, completed: row.completed };
}
function toSession(row) {
  return {
    id: row.id ?? row.session_id ?? "",
    routineId: row.routine_id,
    routineDayId: row.routine_day_id ?? void 0,
    dayName: row.day_name ?? void 0,
    name: row.routine_name ?? row.name ?? "Entrenamiento",
    startedAt: row.started_at,
    finishedAt: row.finished_at ?? void 0,
    durationMinutes: row.duration_minutes ?? void 0,
    status: row.status ?? (row.finished_at ? "completed" : "active"),
    exercises: (row.exercises ?? []).map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exercise_id,
      note: exercise.note ?? void 0,
      sets: (exercise.sets ?? []).map(toSet)
    }))
  };
}

// src/app/state/history.store.ts
var PAGE_SIZE = 50;
var HistoryStore = class _HistoryStore {
  constructor() {
    this.api = inject(WorkoutApi);
    this.status = inject(SyncStatus);
    this.state = signal([], ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    ));
    this.more = signal(false, ...ngDevMode ? [{ debugName: "more" }] : (
      /* istanbul ignore next */
      []
    ));
    this.sessions = this.state.asReadonly();
    this.hasMore = this.more.asReadonly();
  }
  restore(sessions) {
    this.state.set(sessions);
    this.more.set(false);
  }
  /** Reloads the most recent page. */
  load() {
    return this.status.run(async () => {
      const page = await this.api.history(PAGE_SIZE);
      this.state.set(page);
      this.more.set(page.length === PAGE_SIZE);
    });
  }
  loadMore() {
    const oldest = this.state().at(-1);
    if (!oldest)
      return this.load();
    return this.status.run(async () => {
      const page = await this.api.history(PAGE_SIZE, oldest.startedAt);
      this.state.update((sessions) => [...sessions, ...page]);
      this.more.set(page.length === PAGE_SIZE);
    });
  }
  /** Shows a workout finished offline until the server confirms it. */
  addLocal(session) {
    this.state.update((sessions) => [session, ...sessions.filter((item) => item.id !== session.id)]);
  }
  remove(sessionId) {
    this.state.update((sessions) => sessions.filter((session) => session.id !== sessionId));
  }
  static {
    this.\u0275fac = function HistoryStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _HistoryStore)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HistoryStore, factory: _HistoryStore.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HistoryStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/data/progress.api.ts
var ProgressApi = class _ProgressApi {
  async summary() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const row = unwrap(await supabase().rpc("get_my_progress_summary", { p_timezone: timeZone }));
    return {
      sessions: row.sessions,
      completedSets: row.completed_sets,
      volume: row.volume,
      records: row.records.map((record) => ({ exerciseId: record.exercise_id, weight: record.weight, reps: record.reps, date: record.date })),
      trainingDays: row.training_days,
      weeklyVolume: row.weekly_volume.map((week) => ({ weekStart: week.week_start, volume: week.volume }))
    };
  }
  /** Best set of each of the last sessions with this exercise, oldest first. */
  async exerciseProgress(exerciseId) {
    const rows = unwrap(await supabase().rpc("get_my_exercise_progress", { p_exercise_id: exerciseId }));
    return rows.map((row) => ({ date: row.performed_at, weight: row.weight, reps: row.reps })).reverse();
  }
  static {
    this.\u0275fac = function ProgressApi_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProgressApi)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProgressApi, factory: _ProgressApi.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressApi, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/state/progress.store.ts
var EMPTY_SUMMARY = { sessions: 0, completedSets: 0, volume: 0, records: [], trainingDays: [], weeklyVolume: [] };
var ProgressStore = class _ProgressStore {
  constructor() {
    this.api = inject(ProgressApi);
    this.status = inject(SyncStatus);
    this.state = signal(EMPTY_SUMMARY, ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    ));
    this.exerciseState = signal([], ...ngDevMode ? [{ debugName: "exerciseState" }] : (
      /* istanbul ignore next */
      []
    ));
    this.summary = this.state.asReadonly();
    this.selectedExerciseId = signal(null, ...ngDevMode ? [{ debugName: "selectedExerciseId" }] : (
      /* istanbul ignore next */
      []
    ));
    this.exerciseProgress = this.exerciseState.asReadonly();
  }
  restore(summary) {
    this.state.set(summary ?? EMPTY_SUMMARY);
    this.selectedExerciseId.set(null);
    this.exerciseState.set([]);
  }
  load() {
    return this.status.run(async () => this.state.set(await this.api.summary()));
  }
  selectExercise(exerciseId) {
    this.selectedExerciseId.set(exerciseId);
    this.exerciseState.set([]);
    if (!exerciseId)
      return Promise.resolve(true);
    return this.status.run(async () => {
      const points = await this.api.exerciseProgress(exerciseId);
      if (this.selectedExerciseId() === exerciseId)
        this.exerciseState.set(points);
    });
  }
  static {
    this.\u0275fac = function ProgressStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProgressStore)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProgressStore, factory: _ProgressStore.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  WorkoutApi,
  HistoryStore,
  ProgressStore
};
//# sourceMappingURL=chunk-UUWUQZ7C.js.map
