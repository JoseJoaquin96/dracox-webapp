import {
  formatDateTime
} from "./chunk-OKXU5PZQ.js";
import {
  ErrorLogService,
  SyncStatus
} from "./chunk-XI7FFPE6.js";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-2MVRL4DM.js";

// src/app/features/admin-errors/admin-errors.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminErrorsComponent_For_22_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const log_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formatDetails(log_r1.details));
  }
}
function AdminErrorsComponent_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "article", 7)(1, "span", 9);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "div", 10)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(8, AdminErrorsComponent_For_22_Conditional_8_Template, 2, 1, "code");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const log_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("warning", log_r1.severity === "warning");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(log_r1.severity);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(log_r1.message);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", ctx_r1.formatDateTime(log_r1.createdAt), " \xB7 ", log_r1.source, "", log_r1.route ? " \xB7 " + log_r1.route : "");
    \u0275\u0275advance();
    \u0275\u0275conditional(log_r1.details ? 8 : -1);
  }
}
function AdminErrorsComponent_ForEmpty_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 8)(1, "span");
    \u0275\u0275text(2, "\u2713");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "strong");
    \u0275\u0275text(4, "No hay errores registrados");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "small");
    \u0275\u0275text(6, "Los nuevos errores aparecer\xE1n aqu\xED cuando ocurran.");
    \u0275\u0275domElementEnd()();
  }
}
var AdminErrorsComponent = class _AdminErrorsComponent {
  constructor() {
    this.errorLog = inject(ErrorLogService);
    this.status = inject(SyncStatus);
    this.formatDateTime = formatDateTime;
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    ));
    void this.refresh();
  }
  async refresh() {
    if (this.loading())
      return;
    this.loading.set(true);
    await this.status.run(() => this.errorLog.loadRecent(), "admin-errors");
    this.loading.set(false);
  }
  formatDetails(details) {
    return JSON.stringify(details);
  }
  static {
    this.\u0275fac = function AdminErrorsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AdminErrorsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminErrorsComponent, selectors: [["ng-component"]], decls: 24, vars: 4, consts: [[1, "page-heading", "compact-heading"], [1, "eyebrow"], [1, "heading-subtitle"], ["type", "button", 1, "button", "button-outline", 3, "click", "disabled"], [1, "surface-card", "error-log-card"], [1, "section-heading"], [1, "calendar-month"], [1, "error-log-row"], [1, "progress-empty"], [1, "error-log-severity"], [1, "error-log-copy"]], template: function AdminErrorsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElementStart(0, "div", 0)(1, "div")(2, "p", 1);
        \u0275\u0275text(3, "Administraci\xF3n");
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(4, "h1");
        \u0275\u0275text(5, "Registro de ");
        \u0275\u0275domElementStart(6, "em");
        \u0275\u0275text(7, "errores.");
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(8, "p", 2);
        \u0275\u0275text(9, "\xDAltimos fallos capturados por la aplicaci\xF3n para poder detectar problemas reales de uso.");
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(10, "button", 3);
        \u0275\u0275domListener("click", function AdminErrorsComponent_Template_button_click_10_listener() {
          return ctx.refresh();
        });
        \u0275\u0275text(11);
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(12, "section", 4)(13, "div", 5)(14, "div")(15, "span", 1);
        \u0275\u0275text(16, "Observabilidad");
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(17, "h3");
        \u0275\u0275text(18);
        \u0275\u0275domElementEnd()();
        \u0275\u0275domElementStart(19, "span", 6);
        \u0275\u0275text(20, "M\xE1ximo 200");
        \u0275\u0275domElementEnd()();
        \u0275\u0275repeaterCreate(21, AdminErrorsComponent_For_22_Template, 9, 8, "article", 7, _forTrack0, false, AdminErrorsComponent_ForEmpty_23_Template, 7, 0, "div", 8);
        \u0275\u0275domElementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275domProperty("disabled", ctx.loading());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.loading() ? "Cargando\u2026" : "Actualizar", " ");
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate1("", ctx.errorLog.logs().length, " registros recientes");
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.errorLog.logs());
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminErrorsComponent, [{
    type: Component,
    args: [{ template: `<div class="page-heading compact-heading">\r
  <div>\r
    <p class="eyebrow">Administraci\xF3n</p>\r
    <h1>Registro de <em>errores.</em></h1>\r
    <p class="heading-subtitle">\xDAltimos fallos capturados por la aplicaci\xF3n para poder detectar problemas reales de uso.</p>\r
  </div>\r
  <button class="button button-outline" type="button" (click)="refresh()" [disabled]="loading()">\r
    {{ loading() ? 'Cargando\u2026' : 'Actualizar' }}\r
  </button>\r
</div>\r
\r
<section class="surface-card error-log-card">\r
  <div class="section-heading">\r
    <div><span class="eyebrow">Observabilidad</span><h3>{{ errorLog.logs().length }} registros recientes</h3></div>\r
    <span class="calendar-month">M\xE1ximo 200</span>\r
  </div>\r
  @for (log of errorLog.logs(); track log.id) {\r
    <article class="error-log-row">\r
      <span class="error-log-severity" [class.warning]="log.severity === 'warning'">{{ log.severity }}</span>\r
      <div class="error-log-copy">\r
        <strong>{{ log.message }}</strong>\r
        <small>{{ formatDateTime(log.createdAt) }} \xB7 {{ log.source }}{{ log.route ? ' \xB7 ' + log.route : '' }}</small>\r
        @if (log.details) { <code>{{ formatDetails(log.details) }}</code> }\r
      </div>\r
    </article>\r
  } @empty {\r
    <div class="progress-empty">\r
      <span>\u2713</span><strong>No hay errores registrados</strong><small>Los nuevos errores aparecer\xE1n aqu\xED cuando ocurran.</small>\r
    </div>\r
  }\r
</section>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminErrorsComponent, { className: "AdminErrorsComponent", filePath: "src/app/features/admin-errors/admin-errors.component.ts", lineNumber: 9 });
})();
export {
  AdminErrorsComponent
};
//# sourceMappingURL=chunk-P7EZ3Z33.js.map
