import {
  SessionDetailComponent
} from "./chunk-PZZ75RQ2.js";
import {
  estimatedOneRepMax,
  lastWeeksVolume,
  localDayKey,
  monthCalendar,
  sessionTimestamp,
  sessionVolume
} from "./chunk-WJTWJKEM.js";
import {
  RouterLink
} from "./chunk-M3LT6DOY.js";
import "./chunk-7CSBVKAK.js";
import {
  ExerciseStore
} from "./chunk-IRFOAOFN.js";
import {
  HistoryStore,
  ProgressStore
} from "./chunk-UUWUQZ7C.js";
import {
  formatNumber,
  formatShortDate
} from "./chunk-OKXU5PZQ.js";
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
  ɵɵattribute,
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
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-2MVRL4DM.js";

// src/app/features/progress/progress.component.ts
var _forTrack0 = ($index, $item) => $item.label;
var _forTrack1 = ($index, $item) => $item.exerciseId;
var _forTrack2 = ($index, $item) => $item.key;
var _forTrack3 = ($index, $item) => $item.id;
function ProgressComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const week_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", ctx_r2.percent(week_r2.volume, ctx_r2.maxWeekVolume()), "%");
    \u0275\u0275classProp("light", !week_r2.volume)("today", week_r2.isCurrent);
    \u0275\u0275attribute("title", ctx_r2.formatNumber(week_r2.volume) + " kg");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(week_r2.label);
  }
}
function ProgressComponent_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 39)(2, "span", 40);
    \u0275\u0275text(3, "\u2197");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementStart(11, "small");
    \u0275\u0275text(12, "kg");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "span", 6);
    \u0275\u0275text(14, "PR");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const record_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_11_0 = ctx_r2.exercises.byId(record_r4.exerciseId)) == null ? null : tmp_11_0.name) ?? "Ejercicio");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", record_r4.reps, " reps \xB7 1RM est. ", ctx_r2.estimatedOneRepMax(record_r4.weight, record_r4.reps), " kg \xB7 ", ctx_r2.formatShortDate(record_r4.date));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.formatNumber(record_r4.weight), " ");
  }
}
function ProgressComponent_ForEmpty_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2, "\u2197");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "A\xFAn no hay marcas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "Completa algunas series y aparecer\xE1n aqu\xED.");
    \u0275\u0275elementEnd()();
  }
}
function ProgressComponent_For_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const initial_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(initial_r5);
  }
}
function ProgressComponent_For_68_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 43);
    \u0275\u0275listener("click", function ProgressComponent_For_68_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const day_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openDay(day_r7.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("aria-label", "Ver entrenamiento del d\xEDa " + day_r7.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(day_r7.label);
  }
}
function ProgressComponent_For_68_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("muted", !day_r7.inMonth);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(day_r7.label);
  }
}
function ProgressComponent_For_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProgressComponent_For_68_Conditional_0_Template, 2, 2, "button", 41)(1, ProgressComponent_For_68_Conditional_1_Template, 2, 3, "span", 42);
  }
  if (rf & 2) {
    const day_r7 = ctx.$implicit;
    \u0275\u0275conditional(day_r7.trained ? 0 : 1);
  }
}
function ProgressComponent_For_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    const record_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("value", record_r9.exerciseId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(((tmp_12_0 = ctx_r2.exercises.byId(record_r9.exerciseId)) == null ? null : tmp_12_0.name) ?? "Ejercicio");
  }
}
function ProgressComponent_Conditional_91_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const point_r10 = ctx.$implicit;
    const \u0275$index_199_r11 = ctx.$index;
    const \u0275$count_199_r12 = ctx.$count;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", ctx_r2.percent(point_r10.oneRepMax, ctx_r2.maxOneRepMax()), "%");
    \u0275\u0275classProp("today", \u0275$index_199_r11 === \u0275$count_199_r12 - 1);
    \u0275\u0275attribute("title", point_r10.weight + " kg \xD7 " + point_r10.reps + " \u2192 " + point_r10.oneRepMax + " kg");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(point_r10.oneRepMax);
  }
}
function ProgressComponent_Conditional_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 8);
    \u0275\u0275repeaterCreate(2, ProgressComponent_Conditional_91_For_3_Template, 4, 6, "div", 9, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.evolution());
  }
}
function ProgressComponent_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 32);
    \u0275\u0275text(1, "Sin sesiones con peso registrado para este ejercicio.");
    \u0275\u0275elementEnd();
  }
}
function ProgressComponent_For_103_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const session_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 ", session_r14.dayName, " ");
  }
}
function ProgressComponent_For_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function ProgressComponent_For_103_Template_button_click_0_listener() {
      const session_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.detail.set([session_r14]));
    });
    \u0275\u0275elementStart(1, "span", 45);
    \u0275\u0275text(2, "\u2713");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, ProgressComponent_For_103_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "b");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 46);
    \u0275\u0275text(12, "\u203A");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const session_r14 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(session_r14.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(session_r14.dayName && session_r14.dayName !== session_r14.name ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", ctx_r2.sessionDate(session_r14), " \xB7 ", session_r14.durationMinutes ?? 0, " min \xB7 ", ctx_r2.formatNumber(ctx_r2.volume(session_r14)), " kg de volumen");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", session_r14.exercises.length, " ejercicios");
  }
}
function ProgressComponent_ForEmpty_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "span");
    \u0275\u0275text(2, "\u25CC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Tu historial aparecer\xE1 aqu\xED");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "Finaliza tu primera sesi\xF3n para empezar a medir tu progreso.");
    \u0275\u0275elementEnd()();
  }
}
function ProgressComponent_Conditional_105_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function ProgressComponent_Conditional_105_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.history.loadMore());
    });
    \u0275\u0275text(1, "Cargar sesiones anteriores ");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "\u2193");
    \u0275\u0275elementEnd()();
  }
}
function ProgressComponent_Conditional_106_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "dracox-session-detail", 48);
    \u0275\u0275listener("closed", function ProgressComponent_Conditional_106_Template_dracox_session_detail_closed_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.detail.set(null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("sessions", ctx);
  }
}
var ProgressComponent = class _ProgressComponent {
  constructor() {
    this.exercises = inject(ExerciseStore);
    this.history = inject(HistoryStore);
    this.progress = inject(ProgressStore);
    this.now = /* @__PURE__ */ new Date();
    this.formatNumber = formatNumber;
    this.formatShortDate = formatShortDate;
    this.estimatedOneRepMax = estimatedOneRepMax;
    this.weekdayInitials = ["L", "M", "X", "J", "V", "S", "D"];
    this.currentMonth = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(this.now);
    this.summary = this.progress.summary;
    this.weeks = computed(() => lastWeeksVolume(this.summary().weeklyVolume, this.now), ...ngDevMode ? [{ debugName: "weeks" }] : (
      /* istanbul ignore next */
      []
    ));
    this.maxWeekVolume = computed(() => Math.max(...this.weeks().map((week) => week.volume)), ...ngDevMode ? [{ debugName: "maxWeekVolume" }] : (
      /* istanbul ignore next */
      []
    ));
    this.calendar = computed(() => monthCalendar(this.summary().trainingDays, this.now), ...ngDevMode ? [{ debugName: "calendar" }] : (
      /* istanbul ignore next */
      []
    ));
    this.evolution = computed(() => this.progress.exerciseProgress().map((point) => __spreadProps(__spreadValues({}, point), {
      oneRepMax: estimatedOneRepMax(point.weight, point.reps)
    })), ...ngDevMode ? [{ debugName: "evolution" }] : (
      /* istanbul ignore next */
      []
    ));
    this.maxOneRepMax = computed(() => Math.max(0, ...this.evolution().map((point) => point.oneRepMax)), ...ngDevMode ? [{ debugName: "maxOneRepMax" }] : (
      /* istanbul ignore next */
      []
    ));
    this.detail = signal(null, ...ngDevMode ? [{ debugName: "detail" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  openDay(key) {
    this.detail.set(this.history.sessions().filter((session) => localDayKey(sessionTimestamp(session)) === key));
  }
  volume(session) {
    return sessionVolume(session);
  }
  sessionDate(session) {
    return formatShortDate(sessionTimestamp(session));
  }
  percent(value, max) {
    return max > 0 ? Math.round(value / max * 100) : 0;
  }
  static {
    this.\u0275fac = function ProgressComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProgressComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgressComponent, selectors: [["ng-component"]], decls: 107, vars: 11, consts: [["exerciseSelect", ""], [1, "page-heading", "compact-heading"], [1, "eyebrow"], [1, "heading-subtitle"], [1, "progress-highlight"], [1, "highlight-main", "surface-card"], [1, "trend", "positive"], ["aria-label", "Volumen de las \xFAltimas 8 semanas", 1, "chart-area"], [1, "bars"], [1, "bar-column"], [1, "highlight-side", "surface-card"], ["href", "#records", 1, "text-link"], [1, "content-grid", "two-column-grid", "progress-grid"], [1, "surface-card", "chart-card"], [1, "section-heading"], ["routerLink", "/exercises", 1, "text-link"], [1, "lift-row"], [1, "progress-empty"], ["routerLink", "/routines", 1, "full-width-link"], [1, "calendar-month"], [1, "calendar"], [1, "calendar-head"], [1, "calendar-days"], [1, "calendar-legend"], [1, "legend-dot", "done"], [1, "legend-dot"], [1, "surface-card", "chart-card", "progress-evolution"], [1, "field-label", "progress-select"], [3, "change", "value"], ["value", ""], [3, "value"], [1, "chart-area"], [1, "metric-foot"], ["id", "records", 1, "surface-card", "records-card"], ["type", "button", 1, "record-item", "session-history-row"], [1, "progress-empty", "history-empty"], ["type", "button", 1, "full-width-link"], [3, "sessions"], [1, "bar"], [1, "lift-info"], [1, "exercise-mini-avatar", "orange"], ["type", "button", 1, "done"], [3, "muted"], ["type", "button", 1, "done", 3, "click"], ["type", "button", 1, "record-item", "session-history-row", 3, "click"], [1, "record-icon"], ["aria-hidden", "true", 1, "recent-chevron"], ["type", "button", 1, "full-width-link", 3, "click"], [3, "closed", "sessions"]], template: function ProgressComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "p", 2);
        \u0275\u0275text(3, "Datos que cuentan");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "Tu progreso, ");
        \u0275\u0275elementStart(6, "em");
        \u0275\u0275text(7, "en perspectiva.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "p", 3);
        \u0275\u0275text(9, "No busques d\xEDas perfectos. Busca tendencias que se mueven en la direcci\xF3n correcta.");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "section", 4)(11, "article", 5)(12, "div")(13, "span", 2);
        \u0275\u0275text(14, "Volumen registrado");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "strong");
        \u0275\u0275text(16);
        \u0275\u0275elementStart(17, "small");
        \u0275\u0275text(18, "kg");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "span", 6);
        \u0275\u0275text(20);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "div", 7)(22, "div", 8);
        \u0275\u0275repeaterCreate(23, ProgressComponent_For_24_Template, 4, 8, "div", 9, _forTrack0);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "article", 10)(26, "span", 2);
        \u0275\u0275text(27, "Series completadas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "strong");
        \u0275\u0275text(29);
        \u0275\u0275elementStart(30, "small");
        \u0275\u0275text(31, "series");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(32, "p");
        \u0275\u0275text(33, "Tu historial crece cada vez que registras y finalizas una sesi\xF3n.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "a", 11);
        \u0275\u0275text(35, "Ver historial \u2192");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(36, "section", 12)(37, "article", 13)(38, "div", 14)(39, "div")(40, "span", 2);
        \u0275\u0275text(41, "Fuerza");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(42, "h3");
        \u0275\u0275text(43, "Mejores marcas registradas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(44, "a", 15);
        \u0275\u0275text(45, "Por ejercicio \u2192");
        \u0275\u0275elementEnd()();
        \u0275\u0275repeaterCreate(46, ProgressComponent_For_47_Template, 15, 5, "div", 16, _forTrack1, false, ProgressComponent_ForEmpty_48_Template, 7, 0, "div", 17);
        \u0275\u0275elementStart(49, "a", 18);
        \u0275\u0275text(50, "Registrar un nuevo entrenamiento ");
        \u0275\u0275elementStart(51, "span");
        \u0275\u0275text(52, "\u2192");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(53, "article", 13)(54, "div", 14)(55, "div")(56, "span", 2);
        \u0275\u0275text(57, "Constancia");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(58, "h3");
        \u0275\u0275text(59, "Calendario de sesiones");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(60, "span", 19);
        \u0275\u0275text(61);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(62, "div", 20)(63, "div", 21);
        \u0275\u0275repeaterCreate(64, ProgressComponent_For_65_Template, 2, 1, "span", null, \u0275\u0275repeaterTrackByIndex);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "div", 22);
        \u0275\u0275repeaterCreate(67, ProgressComponent_For_68_Template, 2, 1, null, null, _forTrack2);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(69, "div", 23)(70, "span");
        \u0275\u0275element(71, "i", 24);
        \u0275\u0275text(72, "Entrenamiento (pulsa para ver)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(73, "span");
        \u0275\u0275element(74, "i", 25);
        \u0275\u0275text(75, "Descanso");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(76, "section", 26)(77, "div", 14)(78, "div")(79, "span", 2);
        \u0275\u0275text(80, "Evoluci\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(81, "h3");
        \u0275\u0275text(82, "1RM estimado por sesi\xF3n");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(83, "label", 27);
        \u0275\u0275text(84, "Ejercicio ");
        \u0275\u0275elementStart(85, "select", 28, 0);
        \u0275\u0275listener("change", function ProgressComponent_Template_select_change_85_listener() {
          \u0275\u0275restoreView(_r1);
          const exerciseSelect_r8 = \u0275\u0275reference(86);
          return \u0275\u0275resetView(ctx.progress.selectExercise(exerciseSelect_r8.value || null));
        });
        \u0275\u0275elementStart(87, "option", 29);
        \u0275\u0275text(88, "Selecciona un ejercicio\u2026");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(89, ProgressComponent_For_90_Template, 2, 2, "option", 30, _forTrack1);
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(91, ProgressComponent_Conditional_91_Template, 4, 0, "div", 31)(92, ProgressComponent_Conditional_92_Template, 2, 0, "p", 32);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "section", 33)(94, "div", 14)(95, "div")(96, "span", 2);
        \u0275\u0275text(97, "Historial");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(98, "h3");
        \u0275\u0275text(99, "Entrenamientos finalizados");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(100, "span", 19);
        \u0275\u0275text(101);
        \u0275\u0275elementEnd()();
        \u0275\u0275repeaterCreate(102, ProgressComponent_For_103_Template, 13, 6, "button", 34, _forTrack3, false, ProgressComponent_ForEmpty_104_Template, 7, 0, "div", 35);
        \u0275\u0275conditionalCreate(105, ProgressComponent_Conditional_105_Template, 4, 0, "button", 36);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(106, ProgressComponent_Conditional_106_Template, 1, 1, "dracox-session-detail", 37);
      }
      if (rf & 2) {
        let tmp_15_0;
        \u0275\u0275advance(16);
        \u0275\u0275textInterpolate1("", ctx.formatNumber(ctx.summary().volume), " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.summary().sessions, " sesiones finalizadas");
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.weeks());
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1("", ctx.summary().completedSets, " ");
        \u0275\u0275advance(17);
        \u0275\u0275repeater(ctx.summary().records);
        \u0275\u0275advance(15);
        \u0275\u0275textInterpolate(ctx.currentMonth);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.weekdayInitials);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.calendar());
        \u0275\u0275advance(18);
        \u0275\u0275property("value", ctx.progress.selectedExerciseId() ?? "");
        \u0275\u0275advance(4);
        \u0275\u0275repeater(ctx.summary().records);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.evolution().length ? 91 : ctx.progress.selectedExerciseId() ? 92 : -1);
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate1("", ctx.summary().sessions, " sesiones");
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.history.sessions());
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.history.hasMore() ? 105 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_15_0 = ctx.detail()) ? 106 : -1, tmp_15_0);
      }
    }, dependencies: [RouterLink, SessionDetailComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressComponent, [{
    type: Component,
    args: [{ imports: [RouterLink, SessionDetailComponent], template: `<div class="page-heading compact-heading">\r
  <div>\r
    <p class="eyebrow">Datos que cuentan</p>\r
    <h1>Tu progreso, <em>en perspectiva.</em></h1>\r
    <p class="heading-subtitle">No busques d\xEDas perfectos. Busca tendencias que se mueven en la direcci\xF3n correcta.</p>\r
  </div>\r
</div>\r
\r
<section class="progress-highlight">\r
  <article class="highlight-main surface-card">\r
    <div>\r
      <span class="eyebrow">Volumen registrado</span>\r
      <strong>{{ formatNumber(summary().volume) }} <small>kg</small></strong>\r
      <span class="trend positive">{{ summary().sessions }} sesiones finalizadas</span>\r
    </div>\r
    <div class="chart-area" aria-label="Volumen de las \xFAltimas 8 semanas">\r
      <div class="bars">\r
        @for (week of weeks(); track week.label) {\r
          <div class="bar-column">\r
            <i class="bar" [class.light]="!week.volume" [class.today]="week.isCurrent"\r
               [style.height.%]="percent(week.volume, maxWeekVolume())" [attr.title]="formatNumber(week.volume) + ' kg'"></i>\r
            <span>{{ week.label }}</span>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </article>\r
  <article class="highlight-side surface-card">\r
    <span class="eyebrow">Series completadas</span>\r
    <strong>{{ summary().completedSets }} <small>series</small></strong>\r
    <p>Tu historial crece cada vez que registras y finalizas una sesi\xF3n.</p>\r
    <a class="text-link" href="#records">Ver historial \u2192</a>\r
  </article>\r
</section>\r
\r
<section class="content-grid two-column-grid progress-grid">\r
  <article class="surface-card chart-card">\r
    <div class="section-heading">\r
      <div><span class="eyebrow">Fuerza</span><h3>Mejores marcas registradas</h3></div>\r
      <a class="text-link" routerLink="/exercises">Por ejercicio \u2192</a>\r
    </div>\r
    @for (record of summary().records; track record.exerciseId) {\r
      <div class="lift-row">\r
        <div class="lift-info">\r
          <span class="exercise-mini-avatar orange">\u2197</span>\r
          <span>\r
            <strong>{{ exercises.byId(record.exerciseId)?.name ?? 'Ejercicio' }}</strong>\r
            <small>{{ record.reps }} reps \xB7 1RM est. {{ estimatedOneRepMax(record.weight, record.reps) }} kg \xB7 {{ formatShortDate(record.date) }}</small>\r
          </span>\r
        </div>\r
        <strong>{{ formatNumber(record.weight) }} <small>kg</small></strong>\r
        <span class="trend positive">PR</span>\r
      </div>\r
    } @empty {\r
      <div class="progress-empty">\r
        <span>\u2197</span><strong>A\xFAn no hay marcas</strong><small>Completa algunas series y aparecer\xE1n aqu\xED.</small>\r
      </div>\r
    }\r
    <a class="full-width-link" routerLink="/routines">Registrar un nuevo entrenamiento <span>\u2192</span></a>\r
  </article>\r
\r
  <article class="surface-card chart-card">\r
    <div class="section-heading">\r
      <div><span class="eyebrow">Constancia</span><h3>Calendario de sesiones</h3></div>\r
      <span class="calendar-month">{{ currentMonth }}</span>\r
    </div>\r
    <div class="calendar">\r
      <div class="calendar-head">\r
        @for (initial of weekdayInitials; track $index) { <span>{{ initial }}</span> }\r
      </div>\r
      <div class="calendar-days">\r
        @for (day of calendar(); track day.key) {\r
          @if (day.trained) {\r
            <button type="button" class="done" [attr.aria-label]="'Ver entrenamiento del d\xEDa ' + day.label" (click)="openDay(day.key)">{{ day.label }}</button>\r
          } @else {\r
            <span [class.muted]="!day.inMonth">{{ day.label }}</span>\r
          }\r
        }\r
      </div>\r
    </div>\r
    <div class="calendar-legend">\r
      <span><i class="legend-dot done"></i>Entrenamiento (pulsa para ver)</span>\r
      <span><i class="legend-dot"></i>Descanso</span>\r
    </div>\r
  </article>\r
</section>\r
\r
<section class="surface-card chart-card progress-evolution">\r
  <div class="section-heading">\r
    <div><span class="eyebrow">Evoluci\xF3n</span><h3>1RM estimado por sesi\xF3n</h3></div>\r
  </div>\r
  <label class="field-label progress-select">Ejercicio\r
    <select #exerciseSelect [value]="progress.selectedExerciseId() ?? ''" (change)="progress.selectExercise(exerciseSelect.value || null)">\r
      <option value="">Selecciona un ejercicio\u2026</option>\r
      @for (record of summary().records; track record.exerciseId) {\r
        <option [value]="record.exerciseId">{{ exercises.byId(record.exerciseId)?.name ?? 'Ejercicio' }}</option>\r
      }\r
    </select>\r
  </label>\r
  @if (evolution().length) {\r
    <div class="chart-area">\r
      <div class="bars">\r
        @for (point of evolution(); track $index; let last = $last) {\r
          <div class="bar-column">\r
            <i class="bar" [class.today]="last" [style.height.%]="percent(point.oneRepMax, maxOneRepMax())"\r
               [attr.title]="point.weight + ' kg \xD7 ' + point.reps + ' \u2192 ' + point.oneRepMax + ' kg'"></i>\r
            <span>{{ point.oneRepMax }}</span>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  } @else if (progress.selectedExerciseId()) {\r
    <p class="metric-foot">Sin sesiones con peso registrado para este ejercicio.</p>\r
  }\r
</section>\r
\r
<section class="surface-card records-card" id="records">\r
  <div class="section-heading">\r
    <div><span class="eyebrow">Historial</span><h3>Entrenamientos finalizados</h3></div>\r
    <span class="calendar-month">{{ summary().sessions }} sesiones</span>\r
  </div>\r
  @for (session of history.sessions(); track session.id) {\r
    <button type="button" class="record-item session-history-row" (click)="detail.set([session])">\r
      <span class="record-icon">\u2713</span>\r
      <div>\r
        <strong>{{ session.name }}@if (session.dayName && session.dayName !== session.name) { \xB7 {{ session.dayName }} }</strong>\r
        <small>{{ sessionDate(session) }} \xB7 {{ session.durationMinutes ?? 0 }} min \xB7 {{ formatNumber(volume(session)) }} kg de volumen</small>\r
      </div>\r
      <b>{{ session.exercises.length }} ejercicios</b>\r
      <span class="recent-chevron" aria-hidden="true">\u203A</span>\r
    </button>\r
  } @empty {\r
    <div class="progress-empty history-empty">\r
      <span>\u25CC</span><strong>Tu historial aparecer\xE1 aqu\xED</strong><small>Finaliza tu primera sesi\xF3n para empezar a medir tu progreso.</small>\r
    </div>\r
  }\r
  @if (history.hasMore()) {\r
    <button class="full-width-link" type="button" (click)="history.loadMore()">Cargar sesiones anteriores <span>\u2193</span></button>\r
  }\r
</section>\r
\r
@if (detail(); as sessions) {\r
  <dracox-session-detail [sessions]="sessions" (closed)="detail.set(null)" />\r
}\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgressComponent, { className: "ProgressComponent", filePath: "src/app/features/progress/progress.component.ts", lineNumber: 15 });
})();
export {
  ProgressComponent
};
//# sourceMappingURL=chunk-HZQVM6FZ.js.map
