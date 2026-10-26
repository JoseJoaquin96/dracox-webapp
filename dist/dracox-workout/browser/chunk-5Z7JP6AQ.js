import {
  SET_FIELDS,
  lastPerformance,
  routineExercises
} from "./chunk-WJTWJKEM.js";
import {
  Router
} from "./chunk-M3LT6DOY.js";
import {
  ExerciseStore
} from "./chunk-IRFOAOFN.js";
import {
  WorkoutStore
} from "./chunk-BN2ML33X.js";
import {
  RoutineStore
} from "./chunk-GSW2JVWK.js";
import {
  HistoryStore
} from "./chunk-UUWUQZ7C.js";
import {
  formatClock,
  formatPosition
} from "./chunk-OKXU5PZQ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-IDBXHZBV.js";
import "./chunk-XI7FFPE6.js";
import "./chunk-QFXGMDIM.js";
import {
  Component,
  DestroyRef,
  Input,
  ViewChild,
  computed,
  forwardRef,
  inject,
  input,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryAdvance,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵviewQuerySignal
} from "./chunk-2MVRL4DM.js";

// src/app/features/workout/rest-timer.component.ts
var DEFAULT_REST_SECONDS = 90;
var RestTimerComponent = class _RestTimerComponent {
  constructor() {
    this.now = signal(Date.now(), ...ngDevMode ? [{ debugName: "now" }] : (
      /* istanbul ignore next */
      []
    ));
    this.endsAt = signal(null, ...ngDevMode ? [{ debugName: "endsAt" }] : (
      /* istanbul ignore next */
      []
    ));
    this.pausedSeconds = signal(0, ...ngDevMode ? [{ debugName: "pausedSeconds" }] : (
      /* istanbul ignore next */
      []
    ));
    this.duration = signal(DEFAULT_REST_SECONDS, ...ngDevMode ? [{ debugName: "duration" }] : (
      /* istanbul ignore next */
      []
    ));
    this.running = computed(() => this.endsAt() !== null, ...ngDevMode ? [{ debugName: "running" }] : (
      /* istanbul ignore next */
      []
    ));
    this.remaining = computed(() => {
      const endsAt = this.endsAt();
      return endsAt === null ? this.pausedSeconds() : Math.max(0, Math.ceil((endsAt - this.now()) / 1e3));
    }, ...ngDevMode ? [{ debugName: "remaining" }] : (
      /* istanbul ignore next */
      []
    ));
    this.label = computed(() => formatClock(this.remaining()), ...ngDevMode ? [{ debugName: "label" }] : (
      /* istanbul ignore next */
      []
    ));
    this.percent = computed(() => Math.min(100, this.remaining() / this.duration() * 100), ...ngDevMode ? [{ debugName: "percent" }] : (
      /* istanbul ignore next */
      []
    ));
    const timer = setInterval(() => this.tick(), 1e3);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
  start(seconds) {
    if (seconds <= 0)
      return;
    this.duration.set(seconds);
    this.resume(seconds);
  }
  toggle() {
    if (this.running()) {
      this.pausedSeconds.set(this.remaining());
      this.endsAt.set(null);
    } else if (this.remaining() > 0) {
      this.resume(this.remaining());
    } else {
      this.start(this.duration());
    }
  }
  adjust(seconds) {
    const endsAt = this.endsAt();
    if (endsAt === null)
      this.pausedSeconds.update((value) => Math.max(0, value + seconds));
    else
      this.endsAt.set(Math.max(Date.now(), endsAt + seconds * 1e3));
  }
  resume(seconds) {
    this.now.set(Date.now());
    this.endsAt.set(Date.now() + seconds * 1e3);
  }
  tick() {
    this.now.set(Date.now());
    if (!this.running() || this.remaining() > 0)
      return;
    this.endsAt.set(null);
    this.pausedSeconds.set(0);
    navigator.vibrate?.([200, 100, 200]);
  }
  static {
    this.\u0275fac = function RestTimerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RestTimerComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RestTimerComponent, selectors: [["dracox-rest-timer"]], decls: 17, vars: 7, consts: [[1, "timer-card", "surface-card"], [1, "timer-readout"], [1, "eyebrow"], ["role", "timer", "aria-live", "off"], [1, "timer-actions"], ["type", "button", "aria-label", "Restar 15 segundos", 3, "click"], ["type", "button", 1, "timer-main", 3, "click"], ["type", "button", "aria-label", "Sumar 15 segundos", 3, "click"], ["aria-hidden", "true", 1, "timer-bar"]], template: function RestTimerComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElementStart(0, "article", 0)(1, "div", 1)(2, "span", 2);
        \u0275\u0275text(3, "Descanso");
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(4, "strong", 3);
        \u0275\u0275text(5);
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(6, "p");
        \u0275\u0275text(7);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(8, "div", 4)(9, "button", 5);
        \u0275\u0275domListener("click", function RestTimerComponent_Template_button_click_9_listener() {
          return ctx.adjust(-15);
        });
        \u0275\u0275text(10, "- 15s");
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(11, "button", 6);
        \u0275\u0275domListener("click", function RestTimerComponent_Template_button_click_11_listener() {
          return ctx.toggle();
        });
        \u0275\u0275text(12);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(13, "button", 7);
        \u0275\u0275domListener("click", function RestTimerComponent_Template_button_click_13_listener() {
          return ctx.adjust(15);
        });
        \u0275\u0275text(14, "+ 15s");
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(15, "span", 8);
        \u0275\u0275domElement(16, "i");
        \u0275\u0275domElementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275classProp("running", ctx.running());
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.label());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.running() ? "Recupera lo suficiente. Vuelve m\xE1s fuerte." : "Se inicia solo al completar una serie.");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", ctx.running() ? "Pausar" : ctx.remaining() > 0 ? "Continuar" : "Iniciar", " ");
        \u0275\u0275advance(4);
        \u0275\u0275styleProp("width", ctx.percent(), "%");
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RestTimerComponent, [{
    type: Component,
    args: [{ selector: "dracox-rest-timer", template: `<article class="timer-card surface-card" [class.running]="running()">\r
  <div class="timer-readout">\r
    <span class="eyebrow">Descanso</span>\r
    <strong role="timer" aria-live="off">{{ label() }}</strong>\r
  </div>\r
  <p>{{ running() ? 'Recupera lo suficiente. Vuelve m\xE1s fuerte.' : 'Se inicia solo al completar una serie.' }}</p>\r
  <div class="timer-actions">\r
    <button type="button" (click)="adjust(-15)" aria-label="Restar 15 segundos">- 15s</button>\r
    <button type="button" class="timer-main" (click)="toggle()">\r
      {{ running() ? 'Pausar' : remaining() > 0 ? 'Continuar' : 'Iniciar' }}\r
    </button>\r
    <button type="button" (click)="adjust(15)" aria-label="Sumar 15 segundos">+ 15s</button>\r
  </div>\r
  <span class="timer-bar" aria-hidden="true"><i [style.width.%]="percent()"></i></span>\r
</article>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RestTimerComponent, { className: "RestTimerComponent", filePath: "src/app/features/workout/rest-timer.component.ts", lineNumber: 11 });
})();

// src/app/features/workout/workout.component.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.id;
function WorkoutComponent_Conditional_0_For_27_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "kg");
    \u0275\u0275elementEnd();
  }
}
function WorkoutComponent_Conditional_0_For_27_For_26_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 27)(1, "input", 31);
    \u0275\u0275listener("ngModelChange", function WorkoutComponent_Conditional_0_For_27_For_26_Conditional_3_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const set_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.setWeight(set_r6.id, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "small");
    \u0275\u0275text(3, "kg");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    const set_r6 = ctx_r6.$implicit;
    const \u0275$index_90_r8 = ctx_r6.$index;
    \u0275\u0275nextContext();
    const fields_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", set_r6.weight);
    \u0275\u0275attribute("aria-label", fields_r9.weight + " de la serie " + (\u0275$index_90_r8 + 1));
  }
}
function WorkoutComponent_Conditional_0_For_27_For_26_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span");
  }
}
function WorkoutComponent_Conditional_0_For_27_For_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "span", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, WorkoutComponent_Conditional_0_For_27_For_26_Conditional_3_Template, 4, 2, "label", 27)(4, WorkoutComponent_Conditional_0_For_27_For_26_Conditional_4_Template, 1, 0, "span");
    \u0275\u0275elementStart(5, "label", 28)(6, "input", 29);
    \u0275\u0275listener("ngModelChange", function WorkoutComponent_Conditional_0_For_27_For_26_Template_input_ngModelChange_6_listener($event) {
      const set_r6 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.setReps(set_r6.id, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 30);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_0_For_27_For_26_Template_button_click_9_listener() {
      const set_r6 = \u0275\u0275restoreView(_r4).$implicit;
      const sessionExercise_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleSet(sessionExercise_r10.exerciseId, set_r6));
    });
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const set_r6 = ctx.$implicit;
    const \u0275$index_90_r8 = ctx.$index;
    \u0275\u0275nextContext();
    const fields_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275classProp("completed", set_r6.completed);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_90_r8 + 1);
    \u0275\u0275advance();
    \u0275\u0275conditional(fields_r9.weight ? 3 : 4);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", set_r6.reps);
    \u0275\u0275attribute("aria-label", fields_r9.reps + " de la serie " + (\u0275$index_90_r8 + 1));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(set_r6.target);
    \u0275\u0275advance();
    \u0275\u0275classProp("checked", set_r6.completed);
    \u0275\u0275attribute("aria-label", set_r6.completed ? "Desmarcar serie" : "Completar serie");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", set_r6.completed ? "OK" : "\u25CB", " ");
  }
}
function WorkoutComponent_Conditional_0_For_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "article", 11)(2, "div", 17)(3, "div", 18)(4, "span", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "h2");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 20);
    \u0275\u0275text(12, " \xDAltimo entrenamiento ");
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 21)(16, "span");
    \u0275\u0275text(17, "SET");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275conditionalCreate(20, WorkoutComponent_Conditional_0_For_27_Conditional_20_Template, 2, 0, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "OK");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(25, WorkoutComponent_Conditional_0_For_27_For_26_Template, 11, 11, "div", 22, _forTrack0);
    \u0275\u0275elementStart(27, "div", 23)(28, "button", 24);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_0_For_27_Template_button_click_28_listener() {
      const sessionExercise_r10 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.workout.addSet(sessionExercise_r10.id));
    });
    \u0275\u0275text(29, "+ A\xF1adir serie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span");
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const sessionExercise_r10 = ctx.$implicit;
    const \u0275$index_46_r11 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    const exercise_r12 = ctx_r1.exercises.byId(sessionExercise_r10.exerciseId);
    const fields_r13 = \u0275\u0275storeLet(ctx_r1.setFields[(exercise_r12 == null ? null : exercise_r12.kind) ?? "strength"]);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatPosition(\u0275$index_46_r11));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((exercise_r12 == null ? null : exercise_r12.name) ?? "Ejercicio");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(exercise_r12 ? exercise_r12.muscle + " - " + exercise_r12.equipment : "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.previousPerformance().get(sessionExercise_r10.exerciseId) ?? "Sin registro anterior");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", fields_r13.weight == null ? null : fields_r13.weight.toUpperCase(), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(fields_r13.weight ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fields_r13.reps.toUpperCase());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(sessionExercise_r10.sets);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Descanso recomendado ", ctx_r1.formatClock(ctx_r1.restFor(sessionExercise_r10.exerciseId)));
  }
}
function WorkoutComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "button", 2);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_0_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveAndExit());
    });
    \u0275\u0275text(3, "<- Guardar y salir");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 3);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h1");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 4)(9, "span", 5);
    \u0275\u0275element(10, "i");
    \u0275\u0275text(11, " En directo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 6)(13, "section", 7)(14, "div", 8)(15, "div")(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "small");
    \u0275\u0275text(21, "Cada cambio se guarda autom\xE1ticamente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "span", 9);
    \u0275\u0275element(23, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong", 10);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(26, WorkoutComponent_Conditional_0_For_27_Template, 32, 9, "article", 11, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "aside", 12);
    \u0275\u0275element(29, "dracox-rest-timer");
    \u0275\u0275elementStart(30, "article", 13)(31, "span", 14);
    \u0275\u0275text(32, "*");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div")(34, "strong");
    \u0275\u0275text(35, "Hoy toca consistencia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p");
    \u0275\u0275text(37, "Tu mejor serie es la que registras. El resto lo construye el tiempo.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "button", 15);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_0_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveAndExit());
    });
    \u0275\u0275text(39, "Guardar y salir");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "button", 16);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_0_Template_button_click_40_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.finish());
    });
    \u0275\u0275text(41, "Finalizar entrenamiento ");
    \u0275\u0275elementStart(42, "span");
    \u0275\u0275text(43, "OK");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const current_r14 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Sesi\xF3n en curso \xB7 ", ctx_r1.elapsed());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(current_r14.name);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", ctx_r1.completedSets(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("/ ", ctx_r1.totalSets(), " series");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", ctx_r1.progress(), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.progress(), "%");
    \u0275\u0275advance();
    \u0275\u0275repeater(current_r14.exercises);
  }
}
function WorkoutComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "span");
    \u0275\u0275text(2, "!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4, "Ya tienes una sesi\xF3n activa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Gu\xE1rdala o term\xEDnala antes de empezar otro d\xEDa.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 32);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_1_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resumeActive());
    });
    \u0275\u0275text(8, "Continuar sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 15);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_1_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToRoutines());
    });
    \u0275\u0275text(10, "Volver a rutinas");
    \u0275\u0275elementEnd()();
  }
}
function WorkoutComponent_Conditional_2_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "span", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 35);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const plannedExercise_r17 = ctx.$implicit;
    const \u0275$index_189_r18 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    const exercise_r19 = ctx_r1.exercises.byId(plannedExercise_r17.exerciseId);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatPosition(\u0275$index_189_r18));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((exercise_r19 == null ? null : exercise_r19.name) ?? "Ejercicio");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(exercise_r19 ? exercise_r19.muscle + " - " + exercise_r19.equipment : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", plannedExercise_r17.sets, " series \xB7 ", plannedExercise_r17.repRange, " reps \xB7 ", plannedExercise_r17.restSeconds, " s ");
  }
}
function WorkoutComponent_Conditional_2_ForEmpty_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Este d\xEDa no tiene ejercicios configurados.");
    \u0275\u0275elementEnd();
  }
}
function WorkoutComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "button", 2);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_2_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToRoutines());
    });
    \u0275\u0275text(2, "<- Volver a rutinas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "+");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small");
    \u0275\u0275text(10, "La sesi\xF3n a\xFAn no ha comenzado. Pulsa el bot\xF3n cuando est\xE9s preparado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 33);
    \u0275\u0275repeaterCreate(12, WorkoutComponent_Conditional_2_For_13_Template, 10, 6, "div", 34, \u0275\u0275repeaterTrackByIndex, false, WorkoutComponent_Conditional_2_ForEmpty_14_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 32);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_2_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.start());
    });
    \u0275\u0275text(16, "Iniciar sesi\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const planned_r20 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(planned_r20.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_3_0 = ctx_r1.routineDay()) == null ? null : tmp_3_0.name) ?? planned_r20.daysLabel);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(((tmp_4_0 = ctx_r1.routineDay()) == null ? null : tmp_4_0.exercises) ?? \u0275\u0275pureFunction0(3, _c0));
  }
}
function WorkoutComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "span");
    \u0275\u0275text(2, "*");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4, "No se encontr\xF3 la rutina");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Vuelve a rutinas y selecciona un d\xEDa v\xE1lido.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 32);
    \u0275\u0275listener("click", function WorkoutComponent_Conditional_3_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToRoutines());
    });
    \u0275\u0275text(8, "Ver rutinas");
    \u0275\u0275elementEnd()();
  }
}
var DEFAULT_REST_SECONDS2 = 90;
var WorkoutComponent = class _WorkoutComponent {
  constructor() {
    this.routineId = input.required(...ngDevMode ? [{ debugName: "routineId" }] : (
      /* istanbul ignore next */
      []
    ));
    this.routineDayId = input(...ngDevMode ? [void 0, { debugName: "routineDayId" }] : (
      /* istanbul ignore next */
      []
    ));
    this.workout = inject(WorkoutStore);
    this.exercises = inject(ExerciseStore);
    this.routines = inject(RoutineStore);
    this.history = inject(HistoryStore);
    this.router = inject(Router);
    this.restTimer = viewChild(RestTimerComponent, ...ngDevMode ? [{ debugName: "restTimer" }] : (
      /* istanbul ignore next */
      []
    ));
    this.now = signal(Date.now(), ...ngDevMode ? [{ debugName: "now" }] : (
      /* istanbul ignore next */
      []
    ));
    this.formatClock = formatClock;
    this.formatPosition = formatPosition;
    this.setFields = SET_FIELDS;
    this.routine = computed(() => this.routines.byId(this.routineId()) ?? null, ...ngDevMode ? [{ debugName: "routine" }] : (
      /* istanbul ignore next */
      []
    ));
    this.routineDay = computed(() => {
      const days = this.routine()?.days ?? [];
      return days.find((day) => day.id === this.routineDayId()) ?? days[0] ?? null;
    }, ...ngDevMode ? [{ debugName: "routineDay" }] : (
      /* istanbul ignore next */
      []
    ));
    this.session = computed(() => {
      const active = this.workout.active();
      if (!active || active.routineId !== this.routineId())
        return null;
      const dayId = this.routineDayId();
      return !dayId || active.routineDayId === dayId ? active : null;
    }, ...ngDevMode ? [{ debugName: "session" }] : (
      /* istanbul ignore next */
      []
    ));
    this.otherSessionActive = computed(() => this.workout.active() !== null && this.session() === null, ...ngDevMode ? [{ debugName: "otherSessionActive" }] : (
      /* istanbul ignore next */
      []
    ));
    this.totalSets = computed(() => this.allSets().length, ...ngDevMode ? [{ debugName: "totalSets" }] : (
      /* istanbul ignore next */
      []
    ));
    this.completedSets = computed(() => this.allSets().filter((set) => set.completed).length, ...ngDevMode ? [{ debugName: "completedSets" }] : (
      /* istanbul ignore next */
      []
    ));
    this.progress = computed(() => this.totalSets() ? Math.round(this.completedSets() / this.totalSets() * 100) : 0, ...ngDevMode ? [{ debugName: "progress" }] : (
      /* istanbul ignore next */
      []
    ));
    this.elapsed = computed(() => {
      const startedAt = this.session()?.startedAt;
      return formatClock(startedAt ? Math.max(0, Math.floor((this.now() - Date.parse(startedAt)) / 1e3)) : 0);
    }, ...ngDevMode ? [{ debugName: "elapsed" }] : (
      /* istanbul ignore next */
      []
    ));
    this.previousPerformance = computed(() => {
      const sessions = this.history.sessions();
      return new Map(this.session()?.exercises.map(({ exerciseId }) => [exerciseId, lastPerformance(sessions, exerciseId, this.exercises.byId(exerciseId)?.kind)]));
    }, ...ngDevMode ? [{ debugName: "previousPerformance" }] : (
      /* istanbul ignore next */
      []
    ));
    this.plannedRest = computed(() => {
      const session = this.session();
      const routine = session ? this.routines.byId(session.routineId) : void 0;
      if (!session || !routine)
        return /* @__PURE__ */ new Map();
      const day = routine.days.find((item) => item.id === session.routineDayId) ?? routine.days.find((item) => item.name === session.dayName);
      const planned = day?.exercises ?? routineExercises(routine);
      return new Map(planned.map((exercise) => [exercise.exerciseId, exercise.restSeconds]));
    }, ...ngDevMode ? [{ debugName: "plannedRest" }] : (
      /* istanbul ignore next */
      []
    ));
    this.allSets = computed(() => this.session()?.exercises.flatMap((exercise) => exercise.sets) ?? [], ...ngDevMode ? [{ debugName: "allSets" }] : (
      /* istanbul ignore next */
      []
    ));
    const timer = setInterval(() => this.now.set(Date.now()), 1e3);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
  restFor(exerciseId) {
    return this.plannedRest().get(exerciseId) ?? DEFAULT_REST_SECONDS2;
  }
  start() {
    void this.workout.start(this.routineId(), this.routineDayId());
  }
  async saveAndExit() {
    if (this.session())
      await this.workout.save();
    await this.goToRoutines();
  }
  async goToRoutines() {
    await this.router.navigate(["/routines"]);
  }
  async finish() {
    if (await this.workout.finish())
      await this.router.navigate(["/progress"]);
  }
  resumeActive() {
    const active = this.workout.active();
    if (active)
      void this.router.navigate(["/workout", active.routineId, ...active.routineDayId ? [active.routineDayId] : []]);
  }
  setWeight(setId, value) {
    this.workout.updateSet(setId, { weight: toMeasure(value) });
  }
  setReps(setId, value) {
    const reps = toMeasure(value);
    this.workout.updateSet(setId, { reps: reps === null ? null : Math.round(reps) });
  }
  toggleSet(exerciseId, set) {
    this.workout.toggleSet(set.id);
    if (!set.completed)
      this.restTimer()?.start(this.restFor(exerciseId));
  }
  static {
    this.\u0275fac = function WorkoutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkoutComponent, selectors: [["ng-component"]], viewQuery: function WorkoutComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuerySignal(ctx.restTimer, RestTimerComponent, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance();
      }
    }, inputs: { routineId: [1, "routineId"], routineDayId: [1, "routineDayId"] }, decls: 4, vars: 1, consts: [[1, "empty-state", "surface-card"], [1, "workout-header"], ["type", "button", 1, "back-link", 3, "click"], [1, "eyebrow"], [1, "workout-header-actions"], [1, "live-pill"], [1, "workout-layout"], [1, "workout-main"], [1, "workout-progress-row"], [1, "progress-track"], [1, "progress-percent"], [1, "exercise-log-card", "surface-card"], [1, "workout-aside"], [1, "coach-card", "surface-card"], [1, "coach-icon"], ["type", "button", 1, "button", "button-outline", 3, "click"], ["type", "button", 1, "finish-button", 3, "click"], [1, "exercise-log-heading"], [1, "exercise-title"], [1, "exercise-number"], [1, "previous-line"], [1, "sets-header"], [1, "set-row", 3, "completed"], [1, "exercise-card-footer"], ["type", "button", 1, "add-set-button", 3, "click"], [1, "set-row"], [1, "set-number"], [1, "number-field"], [1, "number-field", "reps-field"], ["type", "number", "inputmode", "numeric", "min", "0", "step", "1", "placeholder", "-", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "check-set", 3, "click"], ["type", "number", "inputmode", "decimal", "min", "0", "step", "0.5", "placeholder", "-", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "button", "button-primary", 3, "click"], [1, "preview-exercise-list"], [1, "preview-exercise-row"], [1, "preview-exercise-target"]], template: function WorkoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, WorkoutComponent_Conditional_0_Template, 44, 7)(1, WorkoutComponent_Conditional_1_Template, 11, 0, "div", 0)(2, WorkoutComponent_Conditional_2_Template, 17, 4, "div", 0)(3, WorkoutComponent_Conditional_3_Template, 9, 0, "div", 0);
      }
      if (rf & 2) {
        let tmp_0_0;
        \u0275\u0275conditional((tmp_0_0 = ctx.session()) ? 0 : ctx.otherSessionActive() ? 1 : (tmp_0_0 = ctx.routine()) ? 2 : 3, tmp_0_0);
      }
    }, dependencies: [FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel, RestTimerComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkoutComponent, [{
    type: Component,
    args: [{ imports: [FormsModule, RestTimerComponent], template: `@if (session(); as current) {\r
  <div class="workout-header">\r
    <div>\r
      <button class="back-link" type="button" (click)="saveAndExit()">&lt;- Guardar y salir</button>\r
      <p class="eyebrow">Sesi\xF3n en curso \xB7 {{ elapsed() }}</p>\r
      <h1>{{ current.name }}</h1>\r
    </div>\r
    <div class="workout-header-actions"><span class="live-pill"><i></i> En directo</span></div>\r
  </div>\r
\r
  <div class="workout-layout">\r
    <section class="workout-main">\r
      <div class="workout-progress-row">\r
        <div>\r
          <strong>{{ completedSets() }} <span>/ {{ totalSets() }} series</span></strong>\r
          <small>Cada cambio se guarda autom\xE1ticamente</small>\r
        </div>\r
        <span class="progress-track"><i [style.width.%]="progress()"></i></span>\r
        <strong class="progress-percent">{{ progress() }}%</strong>\r
      </div>\r
\r
      @for (sessionExercise of current.exercises; track sessionExercise.id; let index = $index) {\r
        @let exercise = exercises.byId(sessionExercise.exerciseId);\r
        @let fields = setFields[exercise?.kind ?? 'strength'];\r
        <article class="exercise-log-card surface-card">\r
          <div class="exercise-log-heading">\r
            <div class="exercise-title">\r
              <span class="exercise-number">{{ formatPosition(index) }}</span>\r
              <div>\r
                <h2>{{ exercise?.name ?? 'Ejercicio' }}</h2>\r
                <p>{{ exercise ? exercise.muscle + ' - ' + exercise.equipment : '' }}</p>\r
              </div>\r
            </div>\r
          </div>\r
          <div class="previous-line">\r
            \xDAltimo entrenamiento <strong>{{ previousPerformance().get(sessionExercise.exerciseId) ?? 'Sin registro anterior' }}</strong>\r
          </div>\r
          <div class="sets-header">\r
            <span>SET</span>\r
            <span>{{ fields.weight?.toUpperCase() }} @if (fields.weight) { <small>kg</small> }</span>\r
            <span>{{ fields.reps.toUpperCase() }}</span>\r
            <span>OK</span>\r
          </div>\r
\r
          @for (set of sessionExercise.sets; track set.id; let setIndex = $index) {\r
            <div class="set-row" [class.completed]="set.completed">\r
              <span class="set-number">{{ setIndex + 1 }}</span>\r
              @if (fields.weight) {\r
                <label class="number-field">\r
                  <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="-"\r
                         [attr.aria-label]="fields.weight + ' de la serie ' + (setIndex + 1)"\r
                         [ngModel]="set.weight" (ngModelChange)="setWeight(set.id, $event)" />\r
                  <small>kg</small>\r
                </label>\r
              } @else {\r
                <span></span>\r
              }\r
              <label class="number-field reps-field">\r
                <input type="number" inputmode="numeric" min="0" step="1" placeholder="-"\r
                       [attr.aria-label]="fields.reps + ' de la serie ' + (setIndex + 1)"\r
                       [ngModel]="set.reps" (ngModelChange)="setReps(set.id, $event)" />\r
                <small>{{ set.target }}</small>\r
              </label>\r
              <button class="check-set" type="button" [class.checked]="set.completed" (click)="toggleSet(sessionExercise.exerciseId, set)"\r
                      [attr.aria-label]="set.completed ? 'Desmarcar serie' : 'Completar serie'">\r
                {{ set.completed ? 'OK' : '\u25CB' }}\r
              </button>\r
            </div>\r
          }\r
\r
          <div class="exercise-card-footer">\r
            <button class="add-set-button" type="button" (click)="workout.addSet(sessionExercise.id)">+ A\xF1adir serie</button>\r
            <span>Descanso recomendado {{ formatClock(restFor(sessionExercise.exerciseId)) }}</span>\r
          </div>\r
        </article>\r
      }\r
    </section>\r
\r
    <aside class="workout-aside">\r
      <dracox-rest-timer />\r
      <article class="coach-card surface-card">\r
        <span class="coach-icon">*</span>\r
        <div>\r
          <strong>Hoy toca consistencia</strong>\r
          <p>Tu mejor serie es la que registras. El resto lo construye el tiempo.</p>\r
        </div>\r
      </article>\r
      <button class="button button-outline" type="button" (click)="saveAndExit()">Guardar y salir</button>\r
      <button class="finish-button" type="button" (click)="finish()">Finalizar entrenamiento <span>OK</span></button>\r
    </aside>\r
  </div>\r
} @else if (otherSessionActive()) {\r
  <div class="empty-state surface-card">\r
    <span>!</span>\r
    <h2>Ya tienes una sesi\xF3n activa</h2>\r
    <p>Gu\xE1rdala o term\xEDnala antes de empezar otro d\xEDa.</p>\r
    <button class="button button-primary" type="button" (click)="resumeActive()">Continuar sesi\xF3n</button>\r
    <button class="button button-outline" type="button" (click)="goToRoutines()">Volver a rutinas</button>\r
  </div>\r
} @else if (routine(); as planned) {\r
  <div class="empty-state surface-card">\r
    <button class="back-link" type="button" (click)="goToRoutines()">&lt;- Volver a rutinas</button>\r
    <span>+</span>\r
    <h2>{{ planned.name }}</h2>\r
    <p>{{ routineDay()?.name ?? planned.daysLabel }}</p>\r
    <small>La sesi\xF3n a\xFAn no ha comenzado. Pulsa el bot\xF3n cuando est\xE9s preparado.</small>\r
    <div class="preview-exercise-list">\r
      @for (plannedExercise of routineDay()?.exercises ?? []; track $index; let index = $index) {\r
        @let exercise = exercises.byId(plannedExercise.exerciseId);\r
        <div class="preview-exercise-row">\r
          <span class="exercise-number">{{ formatPosition(index) }}</span>\r
          <div>\r
            <strong>{{ exercise?.name ?? 'Ejercicio' }}</strong>\r
            <small>{{ exercise ? exercise.muscle + ' - ' + exercise.equipment : '' }}</small>\r
          </div>\r
          <span class="preview-exercise-target">\r
            {{ plannedExercise.sets }} series \xB7 {{ plannedExercise.repRange }} reps \xB7 {{ plannedExercise.restSeconds }} s\r
          </span>\r
        </div>\r
      } @empty {\r
        <p>Este d\xEDa no tiene ejercicios configurados.</p>\r
      }\r
    </div>\r
    <button class="button button-primary" type="button" (click)="start()">Iniciar sesi\xF3n</button>\r
  </div>\r
} @else {\r
  <div class="empty-state surface-card">\r
    <span>*</span>\r
    <h2>No se encontr\xF3 la rutina</h2>\r
    <p>Vuelve a rutinas y selecciona un d\xEDa v\xE1lido.</p>\r
    <button class="button button-primary" type="button" (click)="goToRoutines()">Ver rutinas</button>\r
  </div>\r
}\r
` }]
  }], () => [], { routineId: [{ type: Input, args: [{ isSignal: true, alias: "routineId", required: true }] }], routineDayId: [{ type: Input, args: [{ isSignal: true, alias: "routineDayId", required: false }] }], restTimer: [{ type: ViewChild, args: [forwardRef(() => RestTimerComponent), { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkoutComponent, { className: "WorkoutComponent", filePath: "src/app/features/workout/workout.component.ts", lineNumber: 19 });
})();
function toMeasure(value) {
  if (value === null || value === void 0 || value === "")
    return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
export {
  WorkoutComponent
};
//# sourceMappingURL=chunk-5Z7JP6AQ.js.map
