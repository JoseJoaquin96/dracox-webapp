import {
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  supabase,
  unwrap,
  ɵɵdefineInjectable
} from "./chunk-2MVRL4DM.js";

// src/app/data/routine.api.ts
var COLUMNS = `
  id, name, focus, days, duration, color, archived_at,
  routine_days(id, name, position, routine_exercises(exercise_id, position, sets, rep_range, rest_seconds, note))
`;
var RoutineApi = class _RoutineApi {
  async list() {
    const rows = unwrap(await supabase().from("routines").select(COLUMNS).order("created_at"));
    return rows.map(toRoutine);
  }
  async create(draft) {
    unwrap(await supabase().rpc("create_routine_program", toParams(draft)));
  }
  async update(id, draft) {
    unwrap(await supabase().rpc("update_routine_program", __spreadValues({ p_routine_id: id }, toParams(draft))));
  }
  async setArchived(id, archived) {
    unwrap(await supabase().rpc(archived ? "archive_routine" : "unarchive_routine", { p_routine_id: id }));
  }
  static {
    this.\u0275fac = function RoutineApi_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RoutineApi)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoutineApi, factory: _RoutineApi.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoutineApi, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();
var byPosition = (a, b) => a.position - b.position;
function toRoutine(row) {
  return {
    id: row.id,
    name: row.name,
    focus: row.focus,
    daysLabel: row.days,
    duration: row.duration,
    color: row.color,
    archivedAt: row.archived_at,
    days: [...row.routine_days].sort(byPosition).map((day) => ({
      id: day.id,
      name: day.name,
      exercises: [...day.routine_exercises].sort(byPosition).map((exercise) => ({
        exerciseId: exercise.exercise_id,
        sets: exercise.sets,
        repRange: exercise.rep_range,
        restSeconds: exercise.rest_seconds,
        note: exercise.note ?? void 0
      }))
    }))
  };
}
function toParams(draft) {
  return {
    p_name: draft.name,
    p_focus: draft.focus,
    p_duration: draft.duration,
    p_color: draft.color,
    p_days: draft.days.map((day) => ({
      id: day.id ?? null,
      name: day.name,
      exercises: day.exercises.map((exercise) => ({
        exercise_id: exercise.exerciseId,
        sets: exercise.sets,
        rep_range: exercise.repRange,
        rest_seconds: exercise.restSeconds,
        note: exercise.note ?? null
      }))
    }))
  };
}

// src/app/state/routine.store.ts
var RoutineStore = class _RoutineStore {
  constructor() {
    this.api = inject(RoutineApi);
    this.status = inject(SyncStatus);
    this.state = signal([], ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    ));
    this.index = computed(() => new Map(this.state().map((routine) => [routine.id, routine])), ...ngDevMode ? [{ debugName: "index" }] : (
      /* istanbul ignore next */
      []
    ));
    this.active = computed(() => this.state().filter((routine) => !routine.archivedAt), ...ngDevMode ? [{ debugName: "active" }] : (
      /* istanbul ignore next */
      []
    ));
    this.archived = computed(() => this.state().filter((routine) => routine.archivedAt), ...ngDevMode ? [{ debugName: "archived" }] : (
      /* istanbul ignore next */
      []
    ));
    this.all = this.state.asReadonly();
  }
  byId(id) {
    return this.index().get(id);
  }
  restore(routines) {
    this.state.set(routines);
  }
  load() {
    return this.status.run(async () => this.state.set(await this.api.list()));
  }
  create(draft) {
    return this.status.run(async () => {
      await this.api.create(draft);
      this.state.set(await this.api.list());
    });
  }
  update(id, draft) {
    return this.status.run(async () => {
      await this.api.update(id, draft);
      this.state.set(await this.api.list());
    });
  }
  setArchived(id, archived) {
    return this.status.run(async () => {
      await this.api.setArchived(id, archived);
      const archivedAt = archived ? (/* @__PURE__ */ new Date()).toISOString() : null;
      this.state.update((routines) => routines.map((routine) => routine.id === id ? __spreadProps(__spreadValues({}, routine), { archivedAt }) : routine));
    });
  }
  static {
    this.\u0275fac = function RoutineStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RoutineStore)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoutineStore, factory: _RoutineStore.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoutineStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  RoutineStore
};
//# sourceMappingURL=chunk-GSW2JVWK.js.map
