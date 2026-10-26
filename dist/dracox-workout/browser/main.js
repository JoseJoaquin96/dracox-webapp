import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideRouter,
  withComponentInputBinding
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
  HistoryStore,
  ProgressStore
} from "./chunk-UUWUQZ7C.js";
import {
  plural
} from "./chunk-OKXU5PZQ.js";
import {
  ErrorLogService,
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  AuthStore
} from "./chunk-QFXGMDIM.js";
import {
  Component,
  ErrorHandler,
  Injectable,
  computed,
  effect,
  errorMessage,
  inject,
  loadSupabaseConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  setClassMetadata,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-2MVRL4DM.js";

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static {
    this.\u0275fac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["dracox-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "router-outlet");
      }
    }, dependencies: [RouterOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "dracox-root",
      imports: [RouterOutlet],
      template: "<router-outlet />"
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 9 });
})();

// src/app/core/auth/auth.guards.ts
var authGuard = async (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  return auth.isAuthenticated() || router.createUrlTree(["/login"], { queryParams: { redirect: state.url } });
};
var guestGuard = async (route) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  if (route.queryParamMap.get("mode") === "reset")
    return true;
  return !auth.isAuthenticated() || router.createUrlTree(["/"]);
};
var adminGuard = async () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  return auth.isAdmin() || router.createUrlTree(["/"]);
};

// src/app/layout/shell.component.ts
var _c0 = () => ({ exact: true });
function ShellComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 11)(1, "span", 7);
    \u0275\u0275text(2, "!");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Admin");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1, "Sincronizando datos\u2026");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 30);
    \u0275\u0275listener("click", function ShellComponent_Conditional_62_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.status.clearError());
    });
    \u0275\u0275text(4, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx);
  }
}
function ShellComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const count_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", count_r3, " ", ctx_r1.plural(count_r3, "cambio"), " ", ctx_r1.plural(count_r3, "pendiente"), " de sincronizar. ");
  }
}
var ShellComponent = class _ShellComponent {
  constructor() {
    this.auth = inject(AuthStore);
    this.status = inject(SyncStatus);
    this.workout = inject(WorkoutStore);
    this.router = inject(Router);
    this.plural = plural;
    this.pendingCount = this.workout.unsyncedCount;
    this.syncLabel = computed(() => {
      if (this.pendingCount())
        return "Pendiente de sincronizar";
      if (this.status.loading())
        return "Sincronizando";
      if (this.status.error())
        return "Error de sincronizaci\xF3n";
      return "Sincronizado";
    }, ...ngDevMode ? [{ debugName: "syncLabel" }] : (
      /* istanbul ignore next */
      []
    ));
    effect(() => {
      if (!this.auth.isAuthenticated())
        void this.router.navigateByUrl("/login");
    });
  }
  static {
    this.\u0275fac = function ShellComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ShellComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["dracox-shell"]], decls: 86, vars: 12, consts: [[1, "app-shell"], [1, "sidebar"], ["routerLink", "/", "aria-label", "Dracox inicio", 1, "brand"], [1, "brand-mark"], [1, "sidebar-label"], ["aria-label", "Navegaci\xF3n principal", 1, "main-nav"], ["routerLink", "/", "routerLinkActive", "active", 3, "routerLinkActiveOptions"], [1, "nav-icon"], ["routerLink", "/routines", "routerLinkActive", "active"], ["routerLink", "/progress", "routerLinkActive", "active"], ["routerLink", "/exercises", "routerLinkActive", "active"], ["routerLink", "/admin/errors", "routerLinkActive", "active"], [1, "sidebar-bottom"], ["routerLink", "/profile", "aria-label", "Tu perfil", 1, "mini-profile"], [1, "avatar"], [1, "status-dot"], [1, "sidebar-tip"], [1, "tip-icon"], [1, "main-content"], [1, "topbar"], [1, "mobile-brand"], [1, "topbar-actions"], [1, "sync-pill"], ["routerLink", "/profile", "aria-label", "Tu perfil", "title", "Tu perfil", 1, "avatar", "avatar-button"], ["role", "status", 1, "app-status", "app-status-loading"], ["role", "alert", 1, "app-status", "app-status-error"], ["role", "status", 1, "app-status", "app-status-pending"], [1, "page-container"], ["aria-label", "Navegaci\xF3n m\xF3vil", 1, "mobile-nav"], ["routerLink", "/routines", "aria-label", "Rutinas", 1, "mobile-action"], ["type", "button", "aria-label", "Cerrar aviso", 3, "click"]], template: function ShellComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "a", 2)(3, "span", 3);
        \u0275\u0275text(4, "D");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span")(6, "strong");
        \u0275\u0275text(7, "dracox");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "small");
        \u0275\u0275text(9, "TRAINING OS");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "div", 4);
        \u0275\u0275text(11, "Espacio personal");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "nav", 5)(13, "a", 6)(14, "span", 7);
        \u0275\u0275text(15, "\u2302");
        \u0275\u0275elementEnd();
        \u0275\u0275text(16, " Hoy");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "a", 8)(18, "span", 7);
        \u0275\u0275text(19, "\u25A6");
        \u0275\u0275elementEnd();
        \u0275\u0275text(20, " Rutinas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "a", 9)(22, "span", 7);
        \u0275\u0275text(23, "\u25D4");
        \u0275\u0275elementEnd();
        \u0275\u0275text(24, " Progreso");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "a", 10)(26, "span", 7);
        \u0275\u0275text(27, "\u2726");
        \u0275\u0275elementEnd();
        \u0275\u0275text(28, " Ejercicios");
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(29, ShellComponent_Conditional_29_Template, 4, 0, "a", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "div", 12)(31, "a", 13)(32, "span", 14);
        \u0275\u0275text(33);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "span")(35, "strong");
        \u0275\u0275text(36);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "small");
        \u0275\u0275text(38, "Ver perfil");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(39, "span", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "div", 16)(41, "span", 17);
        \u0275\u0275text(42, "\u2733");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "span")(44, "strong");
        \u0275\u0275text(45, "Tu progreso, tu ritmo");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "small");
        \u0275\u0275text(47, "La constancia gana.");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(48, "main", 18)(49, "header", 19)(50, "div", 20)(51, "span", 3);
        \u0275\u0275text(52, "D");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(53, "strong");
        \u0275\u0275text(54, "dracox");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(55, "div", 21)(56, "span", 22);
        \u0275\u0275element(57, "i");
        \u0275\u0275text(58);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(59, "a", 23);
        \u0275\u0275text(60);
        \u0275\u0275elementEnd()()();
        \u0275\u0275conditionalCreate(61, ShellComponent_Conditional_61_Template, 2, 0, "div", 24);
        \u0275\u0275conditionalCreate(62, ShellComponent_Conditional_62_Template, 5, 1, "div", 25);
        \u0275\u0275conditionalCreate(63, ShellComponent_Conditional_63_Template, 2, 3, "div", 26);
        \u0275\u0275elementStart(64, "div", 27);
        \u0275\u0275element(65, "router-outlet");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(66, "nav", 28)(67, "a", 6)(68, "span");
        \u0275\u0275text(69, "\u2302");
        \u0275\u0275elementEnd();
        \u0275\u0275text(70, "Hoy");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "a", 8)(72, "span");
        \u0275\u0275text(73, "\u25A6");
        \u0275\u0275elementEnd();
        \u0275\u0275text(74, "Rutinas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(75, "a", 29)(76, "span");
        \u0275\u0275text(77, "\uFF0B");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(78, "a", 9)(79, "span");
        \u0275\u0275text(80, "\u25D4");
        \u0275\u0275elementEnd();
        \u0275\u0275text(81, "Progreso");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(82, "a", 10)(83, "span");
        \u0275\u0275text(84, "\u2726");
        \u0275\u0275elementEnd();
        \u0275\u0275text(85, "M\xE1s");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_7_0;
        let tmp_8_0;
        \u0275\u0275advance(13);
        \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(10, _c0));
        \u0275\u0275advance(16);
        \u0275\u0275conditional(ctx.auth.isAdmin() ? 29 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(ctx.auth.userInitial());
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.auth.userName());
        \u0275\u0275advance(22);
        \u0275\u0275textInterpolate1(" ", ctx.syncLabel());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.auth.userInitial());
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.status.loading() ? 61 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_7_0 = ctx.status.error()) ? 62 : -1, tmp_7_0);
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_8_0 = ctx.pendingCount()) ? 63 : -1, tmp_8_0);
        \u0275\u0275advance(4);
        \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(11, _c0));
      }
    }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShellComponent, [{
    type: Component,
    args: [{ selector: "dracox-shell", imports: [RouterOutlet, RouterLink, RouterLinkActive], template: `<div class="app-shell">\r
  <aside class="sidebar">\r
    <a class="brand" routerLink="/" aria-label="Dracox inicio">\r
      <span class="brand-mark">D</span>\r
      <span><strong>dracox</strong><small>TRAINING OS</small></span>\r
    </a>\r
\r
    <div class="sidebar-label">Espacio personal</div>\r
    <nav class="main-nav" aria-label="Navegaci\xF3n principal">\r
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span class="nav-icon">\u2302</span> Hoy</a>\r
      <a routerLink="/routines" routerLinkActive="active"><span class="nav-icon">\u25A6</span> Rutinas</a>\r
      <a routerLink="/progress" routerLinkActive="active"><span class="nav-icon">\u25D4</span> Progreso</a>\r
      <a routerLink="/exercises" routerLinkActive="active"><span class="nav-icon">\u2726</span> Ejercicios</a>\r
      @if (auth.isAdmin()) {\r
        <a routerLink="/admin/errors" routerLinkActive="active"><span class="nav-icon">!</span> Admin</a>\r
      }\r
    </nav>\r
\r
    <div class="sidebar-bottom">\r
      <a class="mini-profile" routerLink="/profile" aria-label="Tu perfil">\r
        <span class="avatar">{{ auth.userInitial() }}</span>\r
        <span><strong>{{ auth.userName() }}</strong><small>Ver perfil</small></span>\r
        <span class="status-dot"></span>\r
      </a>\r
      <div class="sidebar-tip">\r
        <span class="tip-icon">\u2733</span>\r
        <span><strong>Tu progreso, tu ritmo</strong><small>La constancia gana.</small></span>\r
      </div>\r
    </div>\r
  </aside>\r
\r
  <main class="main-content">\r
    <header class="topbar">\r
      <div class="mobile-brand"><span class="brand-mark">D</span><strong>dracox</strong></div>\r
      <div class="topbar-actions">\r
        <span class="sync-pill"><i></i> {{ syncLabel() }}</span>\r
        <a class="avatar avatar-button" routerLink="/profile" aria-label="Tu perfil" title="Tu perfil">{{ auth.userInitial() }}</a>\r
      </div>\r
    </header>\r
\r
    @if (status.loading()) {\r
      <div class="app-status app-status-loading" role="status">Sincronizando datos\u2026</div>\r
    }\r
    @if (status.error(); as error) {\r
      <div class="app-status app-status-error" role="alert">\r
        <span>{{ error }}</span>\r
        <button type="button" (click)="status.clearError()" aria-label="Cerrar aviso">\xD7</button>\r
      </div>\r
    }\r
    @if (pendingCount(); as count) {\r
      <div class="app-status app-status-pending" role="status">\r
        {{ count }} {{ plural(count, 'cambio') }} {{ plural(count, 'pendiente') }} de sincronizar.\r
      </div>\r
    }\r
\r
    <div class="page-container"><router-outlet /></div>\r
  </main>\r
\r
  <nav class="mobile-nav" aria-label="Navegaci\xF3n m\xF3vil">\r
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span>\u2302</span>Hoy</a>\r
    <a routerLink="/routines" routerLinkActive="active"><span>\u25A6</span>Rutinas</a>\r
    <a class="mobile-action" routerLink="/routines" aria-label="Rutinas"><span>\uFF0B</span></a>\r
    <a routerLink="/progress" routerLinkActive="active"><span>\u25D4</span>Progreso</a>\r
    <a routerLink="/exercises" routerLinkActive="active"><span>\u2726</span>M\xE1s</a>\r
  </nav>\r
</div>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/layout/shell.component.ts", lineNumber: 13 });
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () => import("./chunk-2DYHRJ2R.js").then((m) => m.LoginComponent)
  },
  {
    path: "",
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: "", loadComponent: () => import("./chunk-3SJK3CBJ.js").then((m) => m.DashboardComponent) },
      { path: "routines", loadComponent: () => import("./chunk-T5UCIOGE.js").then((m) => m.RoutinesComponent) },
      { path: "workout/:routineId/:routineDayId", loadComponent: () => import("./chunk-5Z7JP6AQ.js").then((m) => m.WorkoutComponent) },
      { path: "workout/:routineId", loadComponent: () => import("./chunk-5Z7JP6AQ.js").then((m) => m.WorkoutComponent) },
      { path: "progress", loadComponent: () => import("./chunk-HZQVM6FZ.js").then((m) => m.ProgressComponent) },
      { path: "exercises", loadComponent: () => import("./chunk-2ZGCXDEW.js").then((m) => m.ExercisesComponent) },
      { path: "profile", loadComponent: () => import("./chunk-JVPYOHXF.js").then((m) => m.ProfileComponent) },
      {
        path: "admin/errors",
        canActivate: [adminGuard],
        loadComponent: () => import("./chunk-P7EZ3Z33.js").then((m) => m.AdminErrorsComponent)
      }
    ]
  },
  { path: "**", redirectTo: "" }
];

// src/app/core/app-error-handler.ts
var AppErrorHandler = class _AppErrorHandler {
  constructor() {
    this.errorLog = inject(ErrorLogService);
  }
  handleError(error) {
    console.error(error);
    const details = error instanceof Error && error.stack ? { stack: error.stack.slice(0, 4e3) } : null;
    void this.errorLog.log(errorMessage(error) || "Error desconocido", "angular", details);
  }
  static {
    this.\u0275fac = function AppErrorHandler_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppErrorHandler)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppErrorHandler, factory: _AppErrorHandler.\u0275fac });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppErrorHandler, [{
    type: Injectable
  }], null, null);
})();

// src/app/core/local-cache.ts
var PREFIX = "dracox-cache:v2:";
var LEGACY_PREFIX = "dracox-workout-cache:";
function readCache(userId) {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + userId) ?? "{}") ?? {};
  } catch {
    return {};
  }
}
function writeCache(userId, snapshot) {
  try {
    localStorage.setItem(PREFIX + userId, JSON.stringify(snapshot));
  } catch {
  }
}
function removeCache(userId) {
  try {
    localStorage.removeItem(PREFIX + userId);
  } catch {
  }
}
function removeLegacyCache() {
  try {
    Object.keys(localStorage).filter((key) => key.startsWith(LEGACY_PREFIX)).forEach((key) => localStorage.removeItem(key));
  } catch {
  }
}

// src/app/state/data-sync.ts
var DataSync = class _DataSync {
  constructor() {
    this.auth = inject(AuthStore);
    this.exercises = inject(ExerciseStore);
    this.routines = inject(RoutineStore);
    this.history = inject(HistoryStore);
    this.progress = inject(ProgressStore);
    this.workout = inject(WorkoutStore);
    this.cachedUserId = null;
    removeLegacyCache();
    effect(() => {
      const userId = this.auth.userId();
      untracked(() => this.switchUser(userId));
    });
    effect(() => {
      const snapshot = this.snapshot();
      if (this.cachedUserId)
        writeCache(this.cachedUserId, snapshot);
    });
    window.addEventListener("online", () => void this.workout.sync());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "hidden" || !this.cachedUserId)
        return;
      this.workout.saveBeforeLeaving();
      writeCache(this.cachedUserId, this.snapshot());
    });
  }
  snapshot() {
    return {
      exercises: this.exercises.all(),
      routines: this.routines.all(),
      history: this.history.sessions(),
      progress: this.progress.summary(),
      workout: this.workout.snapshot()
    };
  }
  switchUser(userId) {
    if (userId === this.cachedUserId)
      return;
    if (this.cachedUserId && !userId)
      removeCache(this.cachedUserId);
    this.cachedUserId = null;
    const cache = userId ? readCache(userId) : {};
    this.exercises.restore(cache.exercises ?? []);
    this.routines.restore(cache.routines ?? []);
    this.history.restore(cache.history ?? []);
    this.progress.restore(cache.progress);
    this.workout.restore(cache.workout ?? {});
    if (!userId)
      return;
    this.cachedUserId = userId;
    void Promise.all([this.exercises.load(), this.routines.load(), this.history.load(), this.progress.load(), this.workout.load()]);
  }
  static {
    this.\u0275fac = function DataSync_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DataSync)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DataSync, factory: _DataSync.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataSync, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => {
      inject(DataSync);
    })
  ]
};

// src/main.ts
loadSupabaseConfig().finally(() => {
  bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
});
if ("serviceWorker" in navigator && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  void navigator.serviceWorker.register(new URL("sw.js", document.baseURI));
}
//# sourceMappingURL=main.js.map
