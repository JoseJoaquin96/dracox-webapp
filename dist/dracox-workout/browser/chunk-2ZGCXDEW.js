import {
  ModalComponent
} from "./chunk-7CSBVKAK.js";
import {
  ExerciseStore
} from "./chunk-IRFOAOFN.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-IDBXHZBV.js";
import "./chunk-XI7FFPE6.js";
import "./chunk-QFXGMDIM.js";
import {
  Component,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-2MVRL4DM.js";

// src/app/features/exercises/exercises.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ExercisesComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function ExercisesComponent_For_19_Template_button_click_0_listener() {
      const filter_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.muscleFilter.set(filter_r2));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const filter_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r2.muscleFilter() === filter_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(filter_r2);
  }
}
function ExercisesComponent_For_22_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "button", 18);
    \u0275\u0275listener("click", function ExercisesComponent_For_22_Conditional_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const exercise_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openForm(exercise_r5));
    });
    \u0275\u0275text(2, "Editar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 18);
    \u0275\u0275listener("click", function ExercisesComponent_For_22_Conditional_11_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const exercise_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.remove(exercise_r5));
    });
    \u0275\u0275text(4, "Borrar");
    \u0275\u0275elementEnd()();
  }
}
function ExercisesComponent_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 10)(1, "span", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 15)(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "\xB7");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, ExercisesComponent_For_22_Conditional_11_Template, 5, 0, "div", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 17);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const exercise_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", exercise_r5.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(exercise_r5.initials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(exercise_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", exercise_r5.muscle, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", exercise_r5.equipment);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.exercises.isOwn(exercise_r5) ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.kindLabels[exercise_r5.kind]);
  }
}
function ExercisesComponent_ForEmpty_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "span");
    \u0275\u0275text(2, "\u25CC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "No hay ejercicios que coincidan");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "Prueba con otra b\xFAsqueda o crea uno nuevo.");
    \u0275\u0275elementEnd()();
  }
}
function ExercisesComponent_Conditional_24_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const muscle_r7 = ctx.$implicit;
    \u0275\u0275property("value", muscle_r7);
  }
}
function ExercisesComponent_Conditional_24_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const kind_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", kind_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.kindLabels[kind_r8]);
  }
}
function ExercisesComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "dracox-modal", 19);
    \u0275\u0275listener("closed", function ExercisesComponent_Conditional_24_Template_dracox_modal_closed_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.formOpen.set(false));
    });
    \u0275\u0275elementStart(1, "label", 20);
    \u0275\u0275text(2, "Nombre ");
    \u0275\u0275elementStart(3, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function ExercisesComponent_Conditional_24_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.draft.name, $event) || (ctx_r2.draft.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "label", 20);
    \u0275\u0275text(5, "Grupo muscular ");
    \u0275\u0275elementStart(6, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function ExercisesComponent_Conditional_24_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.draft.muscle, $event) || (ctx_r2.draft.muscle = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "datalist", 23);
    \u0275\u0275repeaterCreate(8, ExercisesComponent_Conditional_24_For_9_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "label", 20);
    \u0275\u0275text(11, "Equipamiento ");
    \u0275\u0275elementStart(12, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ExercisesComponent_Conditional_24_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.draft.equipment, $event) || (ctx_r2.draft.equipment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "label", 20);
    \u0275\u0275text(14, "Tipo ");
    \u0275\u0275elementStart(15, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ExercisesComponent_Conditional_24_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.draft.kind, $event) || (ctx_r2.draft.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(16, ExercisesComponent_Conditional_24_For_17_Template, 2, 2, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 27)(19, "button", 28);
    \u0275\u0275listener("click", function ExercisesComponent_Conditional_24_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.formOpen.set(false));
    });
    \u0275\u0275text(20, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 29);
    \u0275\u0275listener("click", function ExercisesComponent_Conditional_24_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.save());
    });
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("heading", ctx_r2.editing() ? "Edita tu movimiento." : "Crea tu movimiento.");
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.draft.name);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.draft.muscle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.exercises.muscles());
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.draft.equipment);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.draft.kind);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.kinds);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r2.saving() || !ctx_r2.draft.name.trim());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.saving() ? "Guardando..." : "Guardar ejercicio", " ");
  }
}
var ALL_MUSCLES = "Todos";
var KIND_LABELS = {
  strength: "Fuerza",
  bodyweight: "Peso corporal",
  timed: "Tiempo",
  distance: "Distancia"
};
var emptyDraft = () => ({ name: "", muscle: "", equipment: "", kind: "strength" });
var ExercisesComponent = class _ExercisesComponent {
  constructor() {
    this.exercises = inject(ExerciseStore);
    this.kindLabels = KIND_LABELS;
    this.kinds = Object.keys(KIND_LABELS);
    this.query = signal("", ...ngDevMode ? [{ debugName: "query" }] : (
      /* istanbul ignore next */
      []
    ));
    this.muscleFilter = signal(ALL_MUSCLES, ...ngDevMode ? [{ debugName: "muscleFilter" }] : (
      /* istanbul ignore next */
      []
    ));
    this.muscleFilters = computed(() => [ALL_MUSCLES, ...this.exercises.muscles()], ...ngDevMode ? [{ debugName: "muscleFilters" }] : (
      /* istanbul ignore next */
      []
    ));
    this.filtered = computed(() => {
      const query = this.query().toLowerCase().trim();
      const muscle = this.muscleFilter();
      return this.exercises.all().filter((exercise) => (muscle === ALL_MUSCLES || exercise.muscle === muscle) && `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query));
    }, ...ngDevMode ? [{ debugName: "filtered" }] : (
      /* istanbul ignore next */
      []
    ));
    this.formOpen = signal(false, ...ngDevMode ? [{ debugName: "formOpen" }] : (
      /* istanbul ignore next */
      []
    ));
    this.editing = signal(null, ...ngDevMode ? [{ debugName: "editing" }] : (
      /* istanbul ignore next */
      []
    ));
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
      /* istanbul ignore next */
      []
    ));
    this.draft = emptyDraft();
  }
  openForm(exercise = null) {
    this.editing.set(exercise);
    this.draft = exercise ? { name: exercise.name, muscle: exercise.muscle, equipment: exercise.equipment, kind: exercise.kind } : emptyDraft();
    this.formOpen.set(true);
  }
  async save() {
    const draft = __spreadProps(__spreadValues({}, this.draft), { name: this.draft.name.trim(), muscle: this.draft.muscle.trim(), equipment: this.draft.equipment.trim() });
    if (!draft.name || this.saving())
      return;
    this.saving.set(true);
    const editing = this.editing();
    const saved = editing ? await this.exercises.update(editing.id, draft) : await this.exercises.create(draft);
    this.saving.set(false);
    if (saved)
      this.formOpen.set(false);
  }
  remove(exercise) {
    if (window.confirm(`\xBFBorrar el ejercicio "${exercise.name}"?`))
      void this.exercises.remove(exercise.id);
  }
  static {
    this.\u0275fac = function ExercisesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExercisesComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExercisesComponent, selectors: [["ng-component"]], decls: 25, vars: 3, consts: [[1, "page-heading", "compact-heading"], [1, "eyebrow"], [1, "heading-subtitle"], ["type", "button", 1, "button", "button-primary", 3, "click"], [1, "exercise-toolbar"], [1, "search-field"], ["placeholder", "Buscar ejercicio...", 3, "ngModelChange", "ngModel"], [1, "exercise-filters"], ["type", "button", 1, "filter-button", 3, "active"], [1, "exercise-library"], [1, "exercise-library-card", "surface-card"], [1, "progress-empty"], ["eyebrow", "Biblioteca personal", 3, "heading"], ["type", "button", 1, "filter-button", 3, "click"], [1, "exercise-avatar"], [1, "exercise-copy"], [1, "exercise-card-actions"], [1, "exercise-kind"], ["type", "button", 3, "click"], ["eyebrow", "Biblioteca personal", 3, "closed", "heading"], [1, "field-label"], ["maxlength", "80", "placeholder", "Ej. Press inclinado en m\xE1quina", 3, "ngModelChange", "ngModel"], ["maxlength", "40", "list", "muscle-options", "placeholder", "Ej. Pecho", 3, "ngModelChange", "ngModel"], ["id", "muscle-options"], [3, "value"], ["maxlength", "40", "placeholder", "Ej. M\xE1quina", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], [1, "modal-actions"], ["type", "button", 1, "button", "button-outline", 3, "click"], ["type", "button", 1, "button", "button-primary", 3, "click", "disabled"]], template: function ExercisesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "p", 1);
        \u0275\u0275text(3, "Tu biblioteca");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "Encuentra tu ");
        \u0275\u0275elementStart(6, "em");
        \u0275\u0275text(7, "movimiento.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "p", 2);
        \u0275\u0275text(9, "Una biblioteca clara para que cada ejercicio tenga su propio historial.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "button", 3);
        \u0275\u0275listener("click", function ExercisesComponent_Template_button_click_10_listener() {
          return ctx.openForm();
        });
        \u0275\u0275text(11, "+ Crear ejercicio");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 4)(13, "label", 5)(14, "span");
        \u0275\u0275text(15, "Buscar");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "input", 6);
        \u0275\u0275listener("ngModelChange", function ExercisesComponent_Template_input_ngModelChange_16_listener($event) {
          return ctx.query.set($event);
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "div", 7);
        \u0275\u0275repeaterCreate(18, ExercisesComponent_For_19_Template, 2, 3, "button", 8, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "section", 9);
        \u0275\u0275repeaterCreate(21, ExercisesComponent_For_22_Template, 14, 8, "article", 10, _forTrack0, false, ExercisesComponent_ForEmpty_23_Template, 7, 0, "div", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(24, ExercisesComponent_Conditional_24_Template, 23, 7, "dracox-modal", 12);
      }
      if (rf & 2) {
        \u0275\u0275advance(16);
        \u0275\u0275property("ngModel", ctx.query());
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.muscleFilters());
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.filtered());
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.formOpen() ? 24 : -1);
      }
    }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, ModalComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExercisesComponent, [{
    type: Component,
    args: [{ imports: [FormsModule, ModalComponent], template: `<div class="page-heading compact-heading">\r
  <div>\r
    <p class="eyebrow">Tu biblioteca</p>\r
    <h1>Encuentra tu <em>movimiento.</em></h1>\r
    <p class="heading-subtitle">Una biblioteca clara para que cada ejercicio tenga su propio historial.</p>\r
  </div>\r
  <button class="button button-primary" type="button" (click)="openForm()">+ Crear ejercicio</button>\r
</div>\r
\r
<div class="exercise-toolbar">\r
  <label class="search-field"><span>Buscar</span>\r
    <input placeholder="Buscar ejercicio..." [ngModel]="query()" (ngModelChange)="query.set($event)">\r
  </label>\r
  <div class="exercise-filters">\r
    @for (filter of muscleFilters(); track filter) {\r
      <button class="filter-button" type="button" [class.active]="muscleFilter() === filter" (click)="muscleFilter.set(filter)">{{ filter }}</button>\r
    }\r
  </div>\r
</div>\r
\r
<section class="exercise-library">\r
  @for (exercise of filtered(); track exercise.id) {\r
    <article class="exercise-library-card surface-card">\r
      <span class="exercise-avatar" [style.background]="exercise.color">{{ exercise.initials }}</span>\r
      <div class="exercise-copy">\r
        <h2>{{ exercise.name }}</h2>\r
        <p>{{ exercise.muscle }} <span>\xB7</span> {{ exercise.equipment }}</p>\r
        @if (exercises.isOwn(exercise)) {\r
          <div class="exercise-card-actions">\r
            <button type="button" (click)="openForm(exercise)">Editar</button>\r
            <button type="button" (click)="remove(exercise)">Borrar</button>\r
          </div>\r
        }\r
      </div>\r
      <span class="exercise-kind">{{ kindLabels[exercise.kind] }}</span>\r
    </article>\r
  } @empty {\r
    <div class="progress-empty">\r
      <span>\u25CC</span><strong>No hay ejercicios que coincidan</strong><small>Prueba con otra b\xFAsqueda o crea uno nuevo.</small>\r
    </div>\r
  }\r
</section>\r
\r
@if (formOpen()) {\r
  <dracox-modal\r
    eyebrow="Biblioteca personal"\r
    [heading]="editing() ? 'Edita tu movimiento.' : 'Crea tu movimiento.'"\r
    (closed)="formOpen.set(false)">\r
    <label class="field-label">Nombre\r
      <input maxlength="80" placeholder="Ej. Press inclinado en m\xE1quina" [(ngModel)]="draft.name">\r
    </label>\r
    <label class="field-label">Grupo muscular\r
      <input maxlength="40" list="muscle-options" placeholder="Ej. Pecho" [(ngModel)]="draft.muscle">\r
    </label>\r
    <datalist id="muscle-options">\r
      @for (muscle of exercises.muscles(); track muscle) { <option [value]="muscle"></option> }\r
    </datalist>\r
    <label class="field-label">Equipamiento\r
      <input maxlength="40" placeholder="Ej. M\xE1quina" [(ngModel)]="draft.equipment">\r
    </label>\r
    <label class="field-label">Tipo\r
      <select [(ngModel)]="draft.kind">\r
        @for (kind of kinds; track kind) { <option [value]="kind">{{ kindLabels[kind] }}</option> }\r
      </select>\r
    </label>\r
    <div class="modal-actions">\r
      <button class="button button-outline" type="button" (click)="formOpen.set(false)">Cancelar</button>\r
      <button class="button button-primary" type="button" (click)="save()" [disabled]="saving() || !draft.name.trim()">\r
        {{ saving() ? 'Guardando...' : 'Guardar ejercicio' }}\r
      </button>\r
    </div>\r
  </dracox-modal>\r
}\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExercisesComponent, { className: "ExercisesComponent", filePath: "src/app/features/exercises/exercises.component.ts", lineNumber: 22 });
})();
export {
  ExercisesComponent
};
//# sourceMappingURL=chunk-2ZGCXDEW.js.map
