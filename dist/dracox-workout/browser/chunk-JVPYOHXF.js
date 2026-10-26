import {
  WorkoutStore
} from "./chunk-BN2ML33X.js";
import "./chunk-GSW2JVWK.js";
import "./chunk-UUWUQZ7C.js";
import {
  plural
} from "./chunk-OKXU5PZQ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-IDBXHZBV.js";
import "./chunk-XI7FFPE6.js";
import {
  AuthStore
} from "./chunk-QFXGMDIM.js";
import {
  Component,
  inject,
  linkedSignal,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-2MVRL4DM.js";

// src/app/features/profile/profile.component.ts
function ProfileComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
var ProfileComponent = class _ProfileComponent {
  constructor() {
    this.auth = inject(AuthStore);
    this.workout = inject(WorkoutStore);
    this.name = linkedSignal(() => this.auth.displayName() ?? "", ...ngDevMode ? [{ debugName: "name" }] : (
      /* istanbul ignore next */
      []
    ));
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
      /* istanbul ignore next */
      []
    ));
    this.message = signal(null, ...ngDevMode ? [{ debugName: "message" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  async saveName() {
    this.saving.set(true);
    const error = await this.auth.updateDisplayName(this.name());
    this.saving.set(false);
    this.message.set(error ?? "Nombre guardado.");
  }
  async signOut() {
    const pending = this.workout.unsyncedCount();
    const warning = `Tienes ${pending} ${plural(pending, "cambio")} sin sincronizar que se perder\xE1n. \xBFCerrar sesi\xF3n igualmente?`;
    if (pending && !window.confirm(warning))
      return;
    await this.auth.signOut();
  }
  static {
    this.\u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["ng-component"]], decls: 21, vars: 5, consts: [[1, "page-heading", "compact-heading"], [1, "eyebrow"], [1, "heading-subtitle"], [1, "surface-card", "profile-card"], [3, "ngSubmit"], [1, "field-label"], ["name", "displayName", "maxlength", "60", "autocomplete", "given-name", 3, "ngModelChange", "ngModel"], ["role", "status", 1, "metric-foot"], [1, "modal-actions"], ["type", "submit", 1, "button", "button-primary", 3, "disabled"], ["type", "button", 1, "button", "button-outline", 3, "click"]], template: function ProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "p", 1);
        \u0275\u0275text(3, "Tu cuenta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "Tu ");
        \u0275\u0275elementStart(6, "em");
        \u0275\u0275text(7, "perfil.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "p", 2);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "section", 3)(11, "form", 4);
        \u0275\u0275listener("ngSubmit", function ProfileComponent_Template_form_ngSubmit_11_listener() {
          return ctx.saveName();
        });
        \u0275\u0275elementStart(12, "label", 5);
        \u0275\u0275text(13, "Nombre ");
        \u0275\u0275elementStart(14, "input", 6);
        \u0275\u0275listener("ngModelChange", function ProfileComponent_Template_input_ngModelChange_14_listener($event) {
          return ctx.name.set($event);
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(15, ProfileComponent_Conditional_15_Template, 2, 1, "p", 7);
        \u0275\u0275elementStart(16, "div", 8)(17, "button", 9);
        \u0275\u0275text(18);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "button", 10);
        \u0275\u0275listener("click", function ProfileComponent_Template_button_click_19_listener() {
          return ctx.signOut();
        });
        \u0275\u0275text(20, "Cerrar sesi\xF3n");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.auth.email());
        \u0275\u0275advance(5);
        \u0275\u0275property("ngModel", ctx.name());
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_2_0 = ctx.message()) ? 15 : -1, tmp_2_0);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.saving());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.saving() ? "Guardando\u2026" : "Guardar nombre");
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, NgModel, NgForm], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ imports: [FormsModule], template: `<div class="page-heading compact-heading">\r
  <div>\r
    <p class="eyebrow">Tu cuenta</p>\r
    <h1>Tu <em>perfil.</em></h1>\r
    <p class="heading-subtitle">{{ auth.email() }}</p>\r
  </div>\r
</div>\r
\r
<section class="surface-card profile-card">\r
  <form (ngSubmit)="saveName()">\r
    <label class="field-label">Nombre\r
      <input name="displayName" maxlength="60" autocomplete="given-name" [ngModel]="name()" (ngModelChange)="name.set($event)">\r
    </label>\r
    @if (message(); as text) {\r
      <p class="metric-foot" role="status">{{ text }}</p>\r
    }\r
    <div class="modal-actions">\r
      <button class="button button-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Guardando\u2026' : 'Guardar nombre' }}</button>\r
      <button class="button button-outline" type="button" (click)="signOut()">Cerrar sesi\xF3n</button>\r
    </div>\r
  </form>\r
</section>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/features/profile/profile.component.ts", lineNumber: 11 });
})();
export {
  ProfileComponent
};
//# sourceMappingURL=chunk-JVPYOHXF.js.map
