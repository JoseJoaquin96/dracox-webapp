import {
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  AuthStore
} from "./chunk-QFXGMDIM.js";
import {
  AppError,
  Injectable,
  __objRest,
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

// src/app/data/exercise.api.ts
var COLUMNS = "id, owner_id, name, muscle, secondary, equipment, kind, initials, color";
var ExerciseApi = class _ExerciseApi {
  async list() {
    const rows = unwrap(await supabase().from("exercises").select(COLUMNS).order("name"));
    return rows.map((_a) => {
      var _b = _a, { owner_id } = _b, exercise = __objRest(_b, ["owner_id"]);
      return __spreadProps(__spreadValues({}, exercise), { ownerId: owner_id });
    });
  }
  async create(ownerId, draft) {
    unwrap(await supabase().from("exercises").insert(__spreadValues({ owner_id: ownerId, color: "#d8f36a" }, toColumns(draft))));
  }
  async update(id, draft) {
    unwrap(await supabase().from("exercises").update(toColumns(draft)).eq("id", id));
  }
  async remove(id) {
    const deleted = unwrap(await supabase().from("exercises").delete().eq("id", id).select("id"));
    if (!deleted.length)
      throw new AppError("No se puede borrar: el ejercicio se usa en rutinas o entrenamientos.");
  }
  static {
    this.\u0275fac = function ExerciseApi_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExerciseApi)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExerciseApi, factory: _ExerciseApi.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExerciseApi, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();
function toColumns(draft) {
  return {
    name: draft.name,
    muscle: draft.muscle || "General",
    equipment: draft.equipment || "Libre",
    kind: draft.kind,
    initials: initialsOf(draft.name)
  };
}
function initialsOf(name) {
  return name.split(/\s+/).filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

// src/app/state/exercise.store.ts
var ExerciseStore = class _ExerciseStore {
  constructor() {
    this.api = inject(ExerciseApi);
    this.auth = inject(AuthStore);
    this.status = inject(SyncStatus);
    this.state = signal([], ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    ));
    this.index = computed(() => new Map(this.state().map((exercise) => [exercise.id, exercise])), ...ngDevMode ? [{ debugName: "index" }] : (
      /* istanbul ignore next */
      []
    ));
    this.all = this.state.asReadonly();
    this.muscles = computed(() => [...new Set(this.state().map((exercise) => exercise.muscle))].sort((a, b) => a.localeCompare(b, "es")), ...ngDevMode ? [{ debugName: "muscles" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  byId(id) {
    return this.index().get(id);
  }
  restore(exercises) {
    this.state.set(exercises);
  }
  load() {
    return this.status.run(async () => this.state.set(await this.api.list()));
  }
  create(draft) {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      if (!userId)
        throw new AppError("Inicia sesi\xF3n para crear ejercicios.");
      await this.api.create(userId, draft);
      this.state.set(await this.api.list());
    });
  }
  update(id, draft) {
    return this.status.run(async () => {
      await this.api.update(id, draft);
      this.state.set(await this.api.list());
    });
  }
  remove(id) {
    return this.status.run(async () => {
      await this.api.remove(id);
      this.state.update((exercises) => exercises.filter((exercise) => exercise.id !== id));
    });
  }
  isOwn(exercise) {
    return exercise.ownerId !== null && exercise.ownerId === this.auth.userId();
  }
  static {
    this.\u0275fac = function ExerciseStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExerciseStore)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExerciseStore, factory: _ExerciseStore.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExerciseStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ExerciseStore
};
//# sourceMappingURL=chunk-IRFOAOFN.js.map
