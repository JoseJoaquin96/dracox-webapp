import {
  SessionDetailComponent
} from "./chunk-PZZ75RQ2.js";
import {
  completedSetCount,
  localDayKey,
  muscleDistribution,
  nextRoutineDay,
  sessionTimestamp,
  sessionVolume,
  sessionsSince,
  startOfWeek,
  weekActivity
} from "./chunk-WJTWJKEM.js";
import {
  RouterLink
} from "./chunk-M3LT6DOY.js";
import "./chunk-7CSBVKAK.js";
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
  formatNumber,
  formatShortDate,
  plural
} from "./chunk-OKXU5PZQ.js";
import "./chunk-XI7FFPE6.js";
import {
  AuthStore
} from "./chunk-QFXGMDIM.js";
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
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
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
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate4
} from "./chunk-2MVRL4DM.js";

// src/app/features/dashboard/dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.muscle;
var _forTrack2 = ($index, $item) => $item.id;
function DashboardComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\xDAltima vez \xB7 ", ctx);
  }
}
function DashboardComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div")(2, "span", 29);
    \u0275\u0275element(3, "i");
    \u0275\u0275text(4, " En marcha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 30)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "small");
    \u0275\u0275text(13, "ejercicios");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "a", 31);
    \u0275\u0275text(15, "Continuar sesi\xF3n ");
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17, "\u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const active_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(active_r1.dayName ?? active_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(active_r1.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(active_r1.exercises.length);
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", ctx_r1.startLink());
  }
}
function DashboardComponent_Conditional_20_Conditional_14_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_14_0;
    const planned_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_14_0 = ctx_r1.exercises.byId(planned_r3.exerciseId)) == null ? null : tmp_14_0.name) ?? "Ejercicio");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", planned_r3.sets, " \xD7 ", planned_r3.repRange);
  }
}
function DashboardComponent_Conditional_20_Conditional_14_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const day_r4 = \u0275\u0275readContextLet(0);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+ ", day_r4.exercises.length - ctx_r1.previewCount, " m\xE1s");
  }
}
function DashboardComponent_Conditional_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 33);
    \u0275\u0275repeaterCreate(1, DashboardComponent_Conditional_20_Conditional_14_For_2_Template, 5, 3, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275conditionalCreate(3, DashboardComponent_Conditional_20_Conditional_14_Conditional_3_Template, 2, 1, "li", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const day_r4 = \u0275\u0275readContextLet(0);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(day_r4.exercises.slice(0, ctx_r1.previewCount));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(day_r4.exercises.length > ctx_r1.previewCount ? 3 : -1);
  }
}
function DashboardComponent_Conditional_20_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const routine_r5 = \u0275\u0275nextContext();
    const day_r4 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("\u25CC D\xEDa ", routine_r5.days.indexOf(day_r4) + 1, " de ", routine_r5.days.length);
  }
}
function DashboardComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "div", 28)(2, "div")(3, "span", 32);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 30)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "small");
    \u0275\u0275text(13, "ejercicios");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(14, DashboardComponent_Conditional_20_Conditional_14_Template, 4, 1, "ul", 33);
    \u0275\u0275elementStart(15, "div", 34)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, DashboardComponent_Conditional_20_Conditional_20_Template, 2, 2, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "a", 31);
    \u0275\u0275text(22, "Ver sesi\xF3n ");
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "\u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const routine_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    const day_r6 = \u0275\u0275storeLet(ctx_r1.nextDay());
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("color", routine_r5.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(routine_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((day_r6 == null ? null : day_r6.name) ?? routine_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(routine_r5.focus);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((day_r6 == null ? null : day_r6.exercises == null ? null : day_r6.exercises.length) ?? 0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(day_r6 && day_r6.exercises.length ? 14 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\u25F7 ", routine_r5.duration, " min");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u25A4 ", ctx_r1.nextDaySets(), " series");
    \u0275\u0275advance();
    \u0275\u0275conditional(day_r6 ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", ctx_r1.startLink());
  }
}
function DashboardComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div")(2, "span", 32);
    \u0275\u0275text(3, "Hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Nueva rutina");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Empieza a dise\xF1ar tu semana");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 30)(9, "span");
    \u0275\u0275text(10, "0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "small");
    \u0275\u0275text(12, "ejercicios");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "a", 36);
    \u0275\u0275text(14, "Crear rutina ");
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16, "\u2192");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_For_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function DashboardComponent_For_76_Template_button_click_0_listener() {
      const day_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.detail.set(day_r8.sessionsOfDay));
    });
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const day_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("done", day_r8.sessions)("today", day_r8.isToday);
    \u0275\u0275property("disabled", !day_r8.sessions);
    \u0275\u0275attribute("aria-label", day_r8.sessions ? "Ver entrenamiento del " + day_r8.label + " " + day_r8.date : null);
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", day_r8.sessions ? 18 + ctx_r1.percent(day_r8.volume, ctx_r1.maxDayVolume()) * 0.82 : 0, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r8.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r8.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((day_r8.sessionsOfDay[0] == null ? null : day_r8.sessionsOfDay[0].dayName) ?? (day_r8.sessionsOfDay[0] == null ? null : day_r8.sessionsOfDay[0].name) ?? "");
  }
}
function DashboardComponent_For_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 39);
    \u0275\u0275element(2, "i", 40);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7, "series");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 41);
    \u0275\u0275element(9, "i");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    const \u0275$index_270_r10 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", ctx_r1.muscleColors[\u0275$index_270_r10]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r9.muscle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r9.sets, " ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", ctx_r1.percent(row_r9.sets, ctx_r1.muscles()[0].sets), "%");
  }
}
function DashboardComponent_ForEmpty_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "Completa series esta semana para ver c\xF3mo se reparten.");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_For_103_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const session_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 ", session_r12.dayName, " ");
  }
}
function DashboardComponent_For_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function DashboardComponent_For_103_Template_button_click_0_listener() {
      const session_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.detail.set([session_r12]));
    });
    \u0275\u0275elementStart(1, "span", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, DashboardComponent_For_103_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 44);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 45);
    \u0275\u0275text(12, "\u203A");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const session_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(session_r12.name.slice(0, 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(session_r12.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(session_r12.dayName && session_r12.dayName !== session_r12.name ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate4("", ctx_r1.sessionDate(session_r12), " \xB7 ", session_r12.durationMinutes ?? 0, " min \xB7 ", session_r12.exercises.length, " ", ctx_r1.plural(session_r12.exercises.length, "ejercicio"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.formatNumber(ctx_r1.volume(session_r12)), " kg");
  }
}
function DashboardComponent_ForEmpty_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "span");
    \u0275\u0275text(2, "\u25CC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5, "A\xFAn no hay entrenamientos guardados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7, "Completa tu primera sesi\xF3n y aparecer\xE1 aqu\xED.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "a", 46);
    \u0275\u0275text(9, "Empezar \u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("routerLink", ctx_r1.startLink());
  }
}
function DashboardComponent_Conditional_105_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "dracox-session-detail", 47);
    \u0275\u0275listener("closed", function DashboardComponent_Conditional_105_Template_dracox_session_detail_closed_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.detail.set(null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("sessions", ctx);
  }
}
var MUSCLE_COLORS = ["var(--orange)", "var(--violet)", "var(--green)", "#72b6ff"];
var PREVIEW_EXERCISES = 4;
var DashboardComponent = class _DashboardComponent {
  constructor() {
    this.auth = inject(AuthStore);
    this.exercises = inject(ExerciseStore);
    this.history = inject(HistoryStore);
    this.routines = inject(RoutineStore);
    this.now = /* @__PURE__ */ new Date();
    this.formatNumber = formatNumber;
    this.plural = plural;
    this.muscleColors = MUSCLE_COLORS;
    this.previewCount = PREVIEW_EXERCISES;
    this.dateLabel = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(this.now);
    this.detail = signal(null, ...ngDevMode ? [{ debugName: "detail" }] : (
      /* istanbul ignore next */
      []
    ));
    this.activeSession = inject(WorkoutStore).active;
    this.nextRoutine = computed(() => {
      const active = this.routines.active();
      const lastRoutineId = this.history.sessions()[0]?.routineId;
      return active.find((routine) => routine.id === lastRoutineId) ?? active[0] ?? null;
    }, ...ngDevMode ? [{ debugName: "nextRoutine" }] : (
      /* istanbul ignore next */
      []
    ));
    this.nextDay = computed(() => {
      const routine = this.nextRoutine();
      return routine ? nextRoutineDay(routine, this.history.sessions()) : null;
    }, ...ngDevMode ? [{ debugName: "nextDay" }] : (
      /* istanbul ignore next */
      []
    ));
    this.nextDaySets = computed(() => this.nextDay()?.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) ?? 0, ...ngDevMode ? [{ debugName: "nextDaySets" }] : (
      /* istanbul ignore next */
      []
    ));
    this.nextDayLastDone = computed(() => {
      const dayId = this.nextDay()?.id;
      const session = dayId ? this.history.sessions().find((item) => item.routineDayId === dayId) : void 0;
      return session ? formatShortDate(sessionTimestamp(session)) : null;
    }, ...ngDevMode ? [{ debugName: "nextDayLastDone" }] : (
      /* istanbul ignore next */
      []
    ));
    this.startLink = computed(() => {
      const active = this.activeSession();
      if (active)
        return ["/workout", active.routineId, ...active.routineDayId ? [active.routineDayId] : []];
      const routine = this.nextRoutine();
      if (!routine)
        return ["/routines"];
      const dayId = this.nextDay()?.id;
      return ["/workout", routine.id, ...dayId ? [dayId] : []];
    }, ...ngDevMode ? [{ debugName: "startLink" }] : (
      /* istanbul ignore next */
      []
    ));
    this.recentSessions = computed(() => this.history.sessions().slice(0, 5), ...ngDevMode ? [{ debugName: "recentSessions" }] : (
      /* istanbul ignore next */
      []
    ));
    this.weekSessions = computed(() => sessionsSince(this.history.sessions(), startOfWeek(this.now)), ...ngDevMode ? [{ debugName: "weekSessions" }] : (
      /* istanbul ignore next */
      []
    ));
    this.thisWeek = computed(() => totals(this.weekSessions()), ...ngDevMode ? [{ debugName: "thisWeek" }] : (
      /* istanbul ignore next */
      []
    ));
    this.lastWeek = computed(() => {
      const monday = startOfWeek(this.now);
      const previousMonday = new Date(monday);
      previousMonday.setDate(monday.getDate() - 7);
      return totals(sessionsSince(this.history.sessions(), previousMonday).filter((session) => new Date(sessionTimestamp(session)) < monday));
    }, ...ngDevMode ? [{ debugName: "lastWeek" }] : (
      /* istanbul ignore next */
      []
    ));
    this.week = computed(() => weekActivity(this.weekSessions(), this.now).map((day) => __spreadProps(__spreadValues({}, day), {
      sessionsOfDay: this.weekSessions().filter((session) => localDayKey(sessionTimestamp(session)) === day.key)
    })), ...ngDevMode ? [{ debugName: "week" }] : (
      /* istanbul ignore next */
      []
    ));
    this.maxDayVolume = computed(() => Math.max(...this.week().map((day) => day.volume)), ...ngDevMode ? [{ debugName: "maxDayVolume" }] : (
      /* istanbul ignore next */
      []
    ));
    this.muscles = computed(() => muscleDistribution(this.weekSessions(), (id) => this.exercises.byId(id)?.muscle).slice(0, 4), ...ngDevMode ? [{ debugName: "muscles" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  volume(session) {
    return sessionVolume(session);
  }
  sessionDate(session) {
    return formatShortDate(sessionTimestamp(session));
  }
  /** Bar size as a percentage of the largest value. */
  percent(value, max) {
    return max > 0 ? Math.round(value / max * 100) : 0;
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["ng-component"]], decls: 106, vars: 18, consts: [[1, "page-heading", "dashboard-heading"], [1, "eyebrow"], [1, "button", "button-primary", "heading-cta", 3, "routerLink"], [1, "hero-grid"], [1, "next-session-card", "surface-card"], [1, "card-topline"], [1, "card-kicker"], [1, "pulse-dot"], [1, "calendar-month"], [1, "week-card", "surface-card"], [1, "section-heading"], [1, "week-stats"], [1, "week-stat"], [1, "content-grid", "two-column-grid"], [1, "surface-card", "chart-card"], ["routerLink", "/progress", 1, "text-link"], [1, "week-calendar"], ["type", "button", 1, "week-day", 3, "done", "today", "disabled"], [1, "metric-foot", "week-calendar-hint"], [1, "surface-card", "muscle-card"], [1, "muscle-list"], [1, "muscle-row"], [1, "metric-foot"], [1, "surface-card", "recent-card"], [1, "recent-list"], ["type", "button", 1, "recent-item"], [1, "dashboard-empty-history"], [3, "sessions"], [1, "next-session-content"], [1, "routine-pill", "live-pill"], [1, "session-orb"], [1, "card-action", 3, "routerLink"], [1, "routine-pill"], [1, "next-exercise-list"], [1, "session-meta"], [1, "more"], ["routerLink", "/routines", 1, "card-action"], ["type", "button", 1, "week-day", 3, "click", "disabled"], [1, "week-day-fill"], [1, "muscle-name"], [1, "muscle-dot"], [1, "progress-track"], ["type", "button", 1, "recent-item", 3, "click"], [1, "recent-avatar", "push"], [1, "recent-volume"], ["aria-hidden", "true", 1, "recent-chevron"], [1, "text-link", 3, "routerLink"], [3, "closed", "sessions"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "p", 1);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "Hola, ");
        \u0275\u0275elementStart(6, "em");
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(8, "a", 2);
        \u0275\u0275text(9);
        \u0275\u0275elementStart(10, "span");
        \u0275\u0275text(11, "\u2197");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "section", 3)(13, "article", 4)(14, "div", 5)(15, "span", 6);
        \u0275\u0275element(16, "span", 7);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(18, DashboardComponent_Conditional_18_Template, 2, 1, "span", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(19, DashboardComponent_Conditional_19_Template, 18, 4)(20, DashboardComponent_Conditional_20_Template, 25, 12)(21, DashboardComponent_Conditional_21_Template, 17, 0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "article", 9)(23, "div", 10)(24, "div")(25, "span", 1);
        \u0275\u0275text(26, "Resumen");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "h3");
        \u0275\u0275text(28, "Esta semana");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "span", 8);
        \u0275\u0275text(30, "vs. semana pasada");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "div", 11)(32, "div", 12)(33, "span");
        \u0275\u0275text(34, "Sesiones");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "strong");
        \u0275\u0275text(36);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "small");
        \u0275\u0275text(38);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(39, "div", 12)(40, "span");
        \u0275\u0275text(41, "Series");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(42, "strong");
        \u0275\u0275text(43);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "small");
        \u0275\u0275text(45);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(46, "div", 12)(47, "span");
        \u0275\u0275text(48, "Volumen");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "strong");
        \u0275\u0275text(50);
        \u0275\u0275elementStart(51, "small");
        \u0275\u0275text(52, "kg");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(53, "small");
        \u0275\u0275text(54);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(55, "div", 12)(56, "span");
        \u0275\u0275text(57, "Tiempo");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(58, "strong");
        \u0275\u0275text(59);
        \u0275\u0275elementStart(60, "small");
        \u0275\u0275text(61, "min");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(62, "small");
        \u0275\u0275text(63);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(64, "section", 13)(65, "article", 14)(66, "div", 10)(67, "div")(68, "span", 1);
        \u0275\u0275text(69, "Esta semana");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "h3");
        \u0275\u0275text(71, "Actividad de entrenamiento");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(72, "a", 15);
        \u0275\u0275text(73, "Ver mes \u2192");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(74, "div", 16);
        \u0275\u0275repeaterCreate(75, DashboardComponent_For_76_Template, 8, 11, "button", 17, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(77, "p", 18);
        \u0275\u0275text(78, "Pulsa un d\xEDa entrenado para ver ejercicios, pesos y repeticiones.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(79, "article", 19)(80, "div", 10)(81, "div")(82, "span", 1);
        \u0275\u0275text(83, "Distribuci\xF3n semanal");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(84, "h3");
        \u0275\u0275text(85, "Grupos musculares");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(86, "a", 15);
        \u0275\u0275text(87, "Ver todo \u2192");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(88, "div", 20);
        \u0275\u0275repeaterCreate(89, DashboardComponent_For_90_Template, 10, 6, "div", 21, _forTrack1, false, DashboardComponent_ForEmpty_91_Template, 2, 0, "p", 22);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(92, "section", 23)(93, "div", 10)(94, "div")(95, "span", 1);
        \u0275\u0275text(96, "Historial");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(97, "h3");
        \u0275\u0275text(98, "\xDAltimos entrenamientos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(99, "a", 15);
        \u0275\u0275text(100, "Ver historial \u2192");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(101, "div", 24);
        \u0275\u0275repeaterCreate(102, DashboardComponent_For_103_Template, 13, 8, "button", 25, _forTrack2, false, DashboardComponent_ForEmpty_104_Template, 10, 1, "div", 26);
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(105, DashboardComponent_Conditional_105_Template, 1, 1, "dracox-session-detail", 27);
      }
      if (rf & 2) {
        let tmp_5_0;
        let tmp_6_0;
        let tmp_18_0;
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.dateLabel);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.auth.userName(), ".");
        \u0275\u0275advance();
        \u0275\u0275property("routerLink", ctx.startLink());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.activeSession() ? "Continuar sesi\xF3n" : ctx.nextRoutine() ? "Empezar entrenamiento" : "Crear rutina", " ");
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1(" ", ctx.activeSession() ? "Sesi\xF3n en curso" : "Te toca");
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_5_0 = !ctx.activeSession() && ctx.nextDayLastDone()) ? 18 : -1, tmp_5_0);
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_6_0 = ctx.activeSession()) ? 19 : (tmp_6_0 = ctx.nextRoutine()) ? 20 : 21, tmp_6_0);
        \u0275\u0275advance(17);
        \u0275\u0275textInterpolate(ctx.thisWeek().sessions);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.lastWeek().sessions, " la anterior");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.thisWeek().sets);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.lastWeek().sets, " la anterior");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.formatNumber(ctx.thisWeek().volume), " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.formatNumber(ctx.lastWeek().volume), " kg la anterior");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.thisWeek().minutes, " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.lastWeek().minutes, " min la anterior");
        \u0275\u0275advance(12);
        \u0275\u0275repeater(ctx.week());
        \u0275\u0275advance(14);
        \u0275\u0275repeater(ctx.muscles());
        \u0275\u0275advance(13);
        \u0275\u0275repeater(ctx.recentSessions());
        \u0275\u0275advance(3);
        \u0275\u0275conditional((tmp_18_0 = ctx.detail()) ? 105 : -1, tmp_18_0);
      }
    }, dependencies: [RouterLink, SessionDetailComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ imports: [RouterLink, SessionDetailComponent], template: `<div class="page-heading dashboard-heading">\r
  <div>\r
    <p class="eyebrow">{{ dateLabel }}</p>\r
    <h1>Hola, <em>{{ auth.userName() }}.</em></h1>\r
  </div>\r
  <a class="button button-primary heading-cta" [routerLink]="startLink()">\r
    {{ activeSession() ? 'Continuar sesi\xF3n' : nextRoutine() ? 'Empezar entrenamiento' : 'Crear rutina' }} <span>\u2197</span>\r
  </a>\r
</div>\r
\r
<section class="hero-grid">\r
  <article class="next-session-card surface-card">\r
    <div class="card-topline">\r
      <span class="card-kicker"><span class="pulse-dot"></span> {{ activeSession() ? 'Sesi\xF3n en curso' : 'Te toca' }}</span>\r
      @if (!activeSession() && nextDayLastDone(); as lastDone) { <span class="calendar-month">\xDAltima vez \xB7 {{ lastDone }}</span> }\r
    </div>\r
    @if (activeSession(); as active) {\r
      <div class="next-session-content">\r
        <div>\r
          <span class="routine-pill live-pill"><i></i> En marcha</span>\r
          <h2>{{ active.dayName ?? active.name }}</h2>\r
          <p>{{ active.name }}</p>\r
        </div>\r
        <div class="session-orb"><span>{{ active.exercises.length }}</span><small>ejercicios</small></div>\r
      </div>\r
      <a class="card-action" [routerLink]="startLink()">Continuar sesi\xF3n <span>\u2192</span></a>\r
    } @else if (nextRoutine(); as routine) {\r
      @let day = nextDay();\r
      <div class="next-session-content">\r
        <div>\r
          <span class="routine-pill" [style.color]="routine.color">{{ routine.name }}</span>\r
          <h2>{{ day?.name ?? routine.name }}</h2>\r
          <p>{{ routine.focus }}</p>\r
        </div>\r
        <div class="session-orb"><span>{{ day?.exercises?.length ?? 0 }}</span><small>ejercicios</small></div>\r
      </div>\r
      @if (day && day.exercises.length) {\r
        <ul class="next-exercise-list">\r
          @for (planned of day.exercises.slice(0, previewCount); track $index) {\r
            <li>\r
              <span>{{ exercises.byId(planned.exerciseId)?.name ?? 'Ejercicio' }}</span>\r
              <small>{{ planned.sets }} \xD7 {{ planned.repRange }}</small>\r
            </li>\r
          }\r
          @if (day.exercises.length > previewCount) {\r
            <li class="more">+ {{ day.exercises.length - previewCount }} m\xE1s</li>\r
          }\r
        </ul>\r
      }\r
      <div class="session-meta">\r
        <span>\u25F7 {{ routine.duration }} min</span>\r
        <span>\u25A4 {{ nextDaySets() }} series</span>\r
        @if (day) { <span>\u25CC D\xEDa {{ routine.days.indexOf(day) + 1 }} de {{ routine.days.length }}</span> }\r
      </div>\r
      <a class="card-action" [routerLink]="startLink()">Ver sesi\xF3n <span>\u2192</span></a>\r
    } @else {\r
      <div class="next-session-content">\r
        <div>\r
          <span class="routine-pill">Hoy</span>\r
          <h2>Nueva rutina</h2>\r
          <p>Empieza a dise\xF1ar tu semana</p>\r
        </div>\r
        <div class="session-orb"><span>0</span><small>ejercicios</small></div>\r
      </div>\r
      <a class="card-action" routerLink="/routines">Crear rutina <span>\u2192</span></a>\r
    }\r
  </article>\r
\r
  <article class="week-card surface-card">\r
    <div class="section-heading">\r
      <div><span class="eyebrow">Resumen</span><h3>Esta semana</h3></div>\r
      <span class="calendar-month">vs. semana pasada</span>\r
    </div>\r
    <div class="week-stats">\r
      <div class="week-stat">\r
        <span>Sesiones</span>\r
        <strong>{{ thisWeek().sessions }}</strong>\r
        <small>{{ lastWeek().sessions }} la anterior</small>\r
      </div>\r
      <div class="week-stat">\r
        <span>Series</span>\r
        <strong>{{ thisWeek().sets }}</strong>\r
        <small>{{ lastWeek().sets }} la anterior</small>\r
      </div>\r
      <div class="week-stat">\r
        <span>Volumen</span>\r
        <strong>{{ formatNumber(thisWeek().volume) }} <small>kg</small></strong>\r
        <small>{{ formatNumber(lastWeek().volume) }} kg la anterior</small>\r
      </div>\r
      <div class="week-stat">\r
        <span>Tiempo</span>\r
        <strong>{{ thisWeek().minutes }} <small>min</small></strong>\r
        <small>{{ lastWeek().minutes }} min la anterior</small>\r
      </div>\r
    </div>\r
  </article>\r
</section>\r
\r
<section class="content-grid two-column-grid">\r
  <article class="surface-card chart-card">\r
    <div class="section-heading">\r
      <div><span class="eyebrow">Esta semana</span><h3>Actividad de entrenamiento</h3></div>\r
      <a class="text-link" routerLink="/progress">Ver mes \u2192</a>\r
    </div>\r
    <div class="week-calendar">\r
      @for (day of week(); track day.key) {\r
        <button type="button" class="week-day" [class.done]="day.sessions" [class.today]="day.isToday" [disabled]="!day.sessions"\r
                [attr.aria-label]="day.sessions ? 'Ver entrenamiento del ' + day.label + ' ' + day.date : null"\r
                (click)="detail.set(day.sessionsOfDay)">\r
          <i class="week-day-fill" [style.height.%]="day.sessions ? 18 + percent(day.volume, maxDayVolume()) * 0.82 : 0"></i>\r
          <span>{{ day.label }}</span>\r
          <strong>{{ day.date }}</strong>\r
          <small>{{ day.sessionsOfDay[0]?.dayName ?? day.sessionsOfDay[0]?.name ?? '' }}</small>\r
        </button>\r
      }\r
    </div>\r
    <p class="metric-foot week-calendar-hint">Pulsa un d\xEDa entrenado para ver ejercicios, pesos y repeticiones.</p>\r
  </article>\r
\r
  <article class="surface-card muscle-card">\r
    <div class="section-heading">\r
      <div><span class="eyebrow">Distribuci\xF3n semanal</span><h3>Grupos musculares</h3></div>\r
      <a class="text-link" routerLink="/progress">Ver todo \u2192</a>\r
    </div>\r
    <div class="muscle-list">\r
      @for (row of muscles(); track row.muscle; let index = $index) {\r
        <div class="muscle-row">\r
          <span class="muscle-name"><i class="muscle-dot" [style.background]="muscleColors[index]"></i>{{ row.muscle }}</span>\r
          <strong>{{ row.sets }} <small>series</small></strong>\r
          <span class="progress-track"><i [style.width.%]="percent(row.sets, muscles()[0].sets)"></i></span>\r
        </div>\r
      } @empty {\r
        <p class="metric-foot">Completa series esta semana para ver c\xF3mo se reparten.</p>\r
      }\r
    </div>\r
  </article>\r
</section>\r
\r
<section class="surface-card recent-card">\r
  <div class="section-heading">\r
    <div><span class="eyebrow">Historial</span><h3>\xDAltimos entrenamientos</h3></div>\r
    <a class="text-link" routerLink="/progress">Ver historial \u2192</a>\r
  </div>\r
  <div class="recent-list">\r
    @for (session of recentSessions(); track session.id) {\r
      <button type="button" class="recent-item" (click)="detail.set([session])">\r
        <span class="recent-avatar push">{{ session.name.slice(0, 1) }}</span>\r
        <div>\r
          <strong>{{ session.name }}@if (session.dayName && session.dayName !== session.name) { \xB7 {{ session.dayName }} }</strong>\r
          <small>{{ sessionDate(session) }} \xB7 {{ session.durationMinutes ?? 0 }} min \xB7 {{ session.exercises.length }} {{ plural(session.exercises.length, 'ejercicio') }}</small>\r
        </div>\r
        <span class="recent-volume">{{ formatNumber(volume(session)) }} kg</span>\r
        <span class="recent-chevron" aria-hidden="true">\u203A</span>\r
      </button>\r
    } @empty {\r
      <div class="dashboard-empty-history">\r
        <span>\u25CC</span>\r
        <div><strong>A\xFAn no hay entrenamientos guardados</strong><small>Completa tu primera sesi\xF3n y aparecer\xE1 aqu\xED.</small></div>\r
        <a class="text-link" [routerLink]="startLink()">Empezar \u2192</a>\r
      </div>\r
    }\r
  </div>\r
</section>\r
\r
@if (detail(); as sessions) {\r
  <dracox-session-detail [sessions]="sessions" (closed)="detail.set(null)" />\r
}\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 27 });
})();
function totals(sessions) {
  return {
    sessions: sessions.length,
    sets: sessions.reduce((sum, session) => sum + completedSetCount(session), 0),
    volume: sessions.reduce((sum, session) => sum + sessionVolume(session), 0),
    minutes: sessions.reduce((sum, session) => sum + (session.durationMinutes ?? 0), 0)
  };
}
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-3SJK3CBJ.js.map
