import {
  AppError,
  Injectable,
  computed,
  errorMessage,
  inject,
  isSupabaseConfigured,
  setClassMetadata,
  signal,
  supabase,
  toUserMessage,
  unwrap,
  ɵɵdefineInjectable
} from "./chunk-2MVRL4DM.js";

// src/app/core/error-log.service.ts
var ErrorLogService = class _ErrorLogService {
  constructor() {
    this.state = signal([], ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    ));
    this.logs = this.state.asReadonly();
  }
  async log(message, source, details = null) {
    try {
      if (!isSupabaseConfigured())
        return;
      const { data } = await supabase().auth.getSession();
      const userId = data.session?.user.id;
      if (!userId)
        return;
      await supabase().from("app_error_logs").insert({
        user_id: userId,
        severity: "error",
        source: source.slice(0, 100),
        message: message.slice(0, 2e3),
        route: location.pathname.slice(0, 500),
        details
      });
    } catch {
    }
  }
  async loadRecent() {
    const rows = unwrap(await supabase().from("app_error_logs").select("id, user_id, severity, source, message, route, details, created_at").order("created_at", { ascending: false }).limit(200));
    this.state.set(rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      severity: row.severity,
      source: row.source,
      message: row.message,
      route: row.route,
      details: row.details,
      createdAt: row.created_at
    })));
  }
  static {
    this.\u0275fac = function ErrorLogService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorLogService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorLogService, factory: _ErrorLogService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorLogService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/sync-status.ts
var SyncStatus = class _SyncStatus {
  constructor() {
    this.errorLog = inject(ErrorLogService);
    this.running = signal(0, ...ngDevMode ? [{ debugName: "running" }] : (
      /* istanbul ignore next */
      []
    ));
    this.lastError = signal(null, ...ngDevMode ? [{ debugName: "lastError" }] : (
      /* istanbul ignore next */
      []
    ));
    this.loading = computed(() => this.running() > 0, ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    ));
    this.error = this.lastError.asReadonly();
  }
  /** Runs a remote operation and reports its failure. Resolves to whether it succeeded. */
  async run(task, source = "remote") {
    this.running.update((count) => count + 1);
    try {
      await task();
      return true;
    } catch (error) {
      this.report(error, source);
      return false;
    } finally {
      this.running.update((count) => count - 1);
    }
  }
  report(error, source = "remote") {
    this.lastError.set(toUserMessage(error));
    if (!(error instanceof AppError))
      void this.errorLog.log(errorMessage(error), source);
  }
  clearError() {
    this.lastError.set(null);
  }
  static {
    this.\u0275fac = function SyncStatus_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SyncStatus)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SyncStatus, factory: _SyncStatus.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SyncStatus, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ErrorLogService,
  SyncStatus
};
//# sourceMappingURL=chunk-XI7FFPE6.js.map
