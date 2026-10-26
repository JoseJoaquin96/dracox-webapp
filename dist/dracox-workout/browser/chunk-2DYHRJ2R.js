import {
  ActivatedRoute,
  Router
} from "./chunk-M3LT6DOY.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-IDBXHZBV.js";
import {
  AuthStore,
  NgTemplateOutlet
} from "./chunk-QFXGMDIM.js";
import {
  Component,
  computed,
  inject,
  isSupabaseConfigured,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-2MVRL4DM.js";

// src/app/features/login/login.component.ts
function LoginComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h1");
    \u0275\u0275text(1, "Crea una nueva");
    \u0275\u0275element(2, "br");
    \u0275\u0275elementStart(3, "em");
    \u0275\u0275text(4, "contrase\xF1a segura.");
    \u0275\u0275elementEnd()();
  }
}
function LoginComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h1");
    \u0275\u0275text(1, "Tu entrenamiento,");
    \u0275\u0275element(2, "br");
    \u0275\u0275elementStart(3, "em");
    \u0275\u0275text(4, "solo para ti.");
    \u0275\u0275elementEnd()();
  }
}
function LoginComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1, " Falta configurar Supabase. Crea ");
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3, "src/assets/supabase-config.json");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " a partir del archivo de ejemplo. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function LoginComponent_Conditional_18_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function LoginComponent_Conditional_18_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_18_Case_2_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.signIn());
    });
    \u0275\u0275elementStart(1, "label", 11);
    \u0275\u0275text(2, "Email ");
    \u0275\u0275elementStart(3, "input", 12);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_18_Case_2_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "label", 11);
    \u0275\u0275text(5, "Contrase\xF1a ");
    \u0275\u0275elementStart(6, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_18_Case_2_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 15)(10, "button", 16);
    \u0275\u0275listener("click", function LoginComponent_Conditional_18_Case_2_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setMode("forgot"));
    });
    \u0275\u0275text(11, "\xBFHas olvidado la contrase\xF1a?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "p", 17);
    \u0275\u0275text(13, "\xBFNo tienes cuenta? ");
    \u0275\u0275elementStart(14, "button", 16);
    \u0275\u0275listener("click", function LoginComponent_Conditional_18_Case_2_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setMode("register"));
    });
    \u0275\u0275text(15, "Crear cuenta");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.email);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.password);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.busy() || !ctx_r1.email.trim() || !ctx_r1.password);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.busy() ? "Entrando\u2026" : "Iniciar sesi\xF3n", " ");
  }
}
function LoginComponent_Conditional_18_Case_3_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function LoginComponent_Conditional_18_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_18_Case_3_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.register());
    });
    \u0275\u0275elementStart(1, "label", 11);
    \u0275\u0275text(2, "Nombre ");
    \u0275\u0275elementStart(3, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_18_Case_3_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.displayName, $event) || (ctx_r1.displayName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "label", 11);
    \u0275\u0275text(5, "Email ");
    \u0275\u0275elementStart(6, "input", 12);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_18_Case_3_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, LoginComponent_Conditional_18_Case_3_ng_container_7_Template, 1, 0, "ng-container", 19);
    \u0275\u0275elementStart(8, "button", 14);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 17);
    \u0275\u0275text(11, "\xBFYa tienes cuenta? ");
    \u0275\u0275elementStart(12, "button", 16);
    \u0275\u0275listener("click", function LoginComponent_Conditional_18_Case_3_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setMode("login"));
    });
    \u0275\u0275text(13, "Iniciar sesi\xF3n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const newPassword_r4 = \u0275\u0275reference(20);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.displayName);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.email);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", newPassword_r4);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.busy() || !ctx_r1.email.trim() || !ctx_r1.passwordPairValid());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.busy() ? "Creando cuenta\u2026" : "Crear cuenta", " ");
  }
}
function LoginComponent_Conditional_18_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_18_Case_4_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.requestReset());
    });
    \u0275\u0275elementStart(1, "label", 11);
    \u0275\u0275text(2, "Email ");
    \u0275\u0275elementStart(3, "input", 12);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_18_Case_4_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 17)(7, "button", 16);
    \u0275\u0275listener("click", function LoginComponent_Conditional_18_Case_4_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setMode("login"));
    });
    \u0275\u0275text(8, "Volver a iniciar sesi\xF3n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.email);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.busy() || !ctx_r1.email.trim());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.busy() ? "Enviando\u2026" : "Enviar enlace", " ");
  }
}
function LoginComponent_Conditional_18_Case_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function LoginComponent_Conditional_18_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_18_Case_5_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resetPassword());
    });
    \u0275\u0275template(1, LoginComponent_Conditional_18_Case_5_ng_container_1_Template, 1, 0, "ng-container", 19);
    \u0275\u0275elementStart(2, "button", 14);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const newPassword_r4 = \u0275\u0275reference(20);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", newPassword_r4);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.busy() || !ctx_r1.passwordPairValid());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.busy() ? "Guardando\u2026" : "Guardar contrase\xF1a", " ");
  }
}
function LoginComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, LoginComponent_Conditional_18_Conditional_0_Template, 2, 1, "div", 8);
    \u0275\u0275conditionalCreate(1, LoginComponent_Conditional_18_Conditional_1_Template, 2, 1, "p", 9);
    \u0275\u0275conditionalCreate(2, LoginComponent_Conditional_18_Case_2_Template, 16, 4, "form")(3, LoginComponent_Conditional_18_Case_3_Template, 14, 5, "form")(4, LoginComponent_Conditional_18_Case_4_Template, 9, 3, "form")(5, LoginComponent_Conditional_18_Case_5_Template, 4, 3, "form");
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.success()) ? 0 : -1, tmp_2_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.error()) ? 1 : -1, tmp_3_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.mode()) === "login" ? 2 : tmp_4_0 === "register" ? 3 : tmp_4_0 === "forgot" ? 4 : tmp_4_0 === "reset" ? 5 : -1);
  }
}
function LoginComponent_ng_template_19_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Usa al menos ", ctx_r1.minPasswordLength, " caracteres.");
  }
}
function LoginComponent_ng_template_19_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 22);
    \u0275\u0275text(1, "Las contrase\xF1as no coinciden.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_ng_template_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_ng_template_19_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "label", 11);
    \u0275\u0275text(4, "Repite la contrase\xF1a ");
    \u0275\u0275elementStart(5, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_ng_template_19_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.confirmPassword, $event) || (ctx_r1.confirmPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, LoginComponent_ng_template_19_Conditional_6_Template, 2, 1, "small", 22);
    \u0275\u0275conditionalCreate(7, LoginComponent_ng_template_19_Conditional_7_Template, 2, 0, "small", 22);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.mode() === "reset" ? "Nueva contrase\xF1a" : "Contrase\xF1a", " ");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.password);
    \u0275\u0275property("minlength", ctx_r1.minPasswordLength);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.confirmPassword);
    \u0275\u0275property("minlength", ctx_r1.minPasswordLength);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.password && ctx_r1.password.length < ctx_r1.minPasswordLength ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.confirmPassword && ctx_r1.password !== ctx_r1.confirmPassword ? 7 : -1);
  }
}
var SUBTITLES = {
  login: "Inicia sesi\xF3n para consultar tus rutinas y guardar tu progreso.",
  register: "Crea tu cuenta para guardar tus rutinas y tu progreso.",
  forgot: "Te enviaremos un enlace para recuperar el acceso.",
  reset: "Elige una contrase\xF1a nueva para proteger tu cuenta."
};
var MIN_PASSWORD_LENGTH = 8;
var LoginComponent = class _LoginComponent {
  constructor() {
    this.auth = inject(AuthStore);
    this.router = inject(Router);
    this.route = inject(ActivatedRoute);
    this.supabaseConfigured = isSupabaseConfigured();
    this.minPasswordLength = MIN_PASSWORD_LENGTH;
    this.mode = signal(this.route.snapshot.queryParamMap.get("mode") === "reset" ? "reset" : "login", ...ngDevMode ? [{ debugName: "mode" }] : (
      /* istanbul ignore next */
      []
    ));
    this.subtitle = computed(() => SUBTITLES[this.mode()], ...ngDevMode ? [{ debugName: "subtitle" }] : (
      /* istanbul ignore next */
      []
    ));
    this.busy = signal(false, ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    ));
    this.error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    ));
    this.success = signal(null, ...ngDevMode ? [{ debugName: "success" }] : (
      /* istanbul ignore next */
      []
    ));
    this.email = "";
    this.displayName = "";
    this.password = "";
    this.confirmPassword = "";
  }
  setMode(mode) {
    this.mode.set(mode);
    this.error.set(null);
    this.success.set(null);
    this.password = "";
    this.confirmPassword = "";
  }
  passwordPairValid() {
    return this.password.length >= MIN_PASSWORD_LENGTH && this.password === this.confirmPassword;
  }
  signIn() {
    return this.submit(async () => {
      const error = await this.auth.signIn(this.email.trim(), this.password);
      if (error)
        return error;
      await this.router.navigateByUrl(this.redirectTarget());
      return null;
    });
  }
  register() {
    return this.submit(async () => {
      const result = await this.auth.signUp(this.email.trim(), this.password, this.displayName);
      if (result.error)
        return result.error;
      if (!result.needsConfirmation) {
        await this.router.navigateByUrl(this.redirectTarget());
        return null;
      }
      this.setMode("login");
      this.success.set("Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesi\xF3n.");
      return null;
    });
  }
  requestReset() {
    return this.submit(async () => {
      const error = await this.auth.requestPasswordReset(this.email.trim());
      if (!error)
        this.success.set("Si el correo existe, recibir\xE1s un enlace para recuperar tu cuenta.");
      return error;
    });
  }
  resetPassword() {
    return this.submit(async () => {
      const error = await this.auth.updatePassword(this.password);
      if (!error)
        await this.router.navigateByUrl("/");
      return error;
    });
  }
  /** Runs a form action that resolves to an error message (or null on success). */
  async submit(action) {
    if (this.busy())
      return;
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    this.error.set(await action());
    this.busy.set(false);
  }
  redirectTarget() {
    const redirect = this.route.snapshot.queryParamMap.get("redirect");
    return redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoginComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["ng-component"]], decls: 21, vars: 3, consts: [["newPassword", ""], [1, "login-page"], [1, "login-card", "surface-card"], [1, "brand", "login-brand"], [1, "brand-mark"], [1, "login-heading"], [1, "eyebrow"], [1, "login-message", "login-warning"], [1, "login-message", "login-success"], [1, "login-error"], [3, "ngSubmit"], [1, "field-label"], ["type", "email", "name", "email", "autocomplete", "email", "required", "", 3, "ngModelChange", "ngModel"], ["type", "password", "name", "password", "autocomplete", "current-password", "required", "", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "button", "button-primary", "login-submit", 3, "disabled"], [1, "login-actions"], ["type", "button", 1, "login-link", 3, "click"], [1, "auth-switch"], ["type", "text", "name", "displayName", "autocomplete", "given-name", "maxlength", "60", 3, "ngModelChange", "ngModel"], [4, "ngTemplateOutlet"], ["type", "password", "name", "password", "autocomplete", "new-password", "required", "", 3, "ngModelChange", "ngModel", "minlength"], ["type", "password", "name", "confirmPassword", "autocomplete", "new-password", "required", "", 3, "ngModelChange", "ngModel", "minlength"], [1, "password-hint"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "main", 1)(1, "section", 2)(2, "div", 3)(3, "span", 4);
        \u0275\u0275text(4, "D");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span")(6, "strong");
        \u0275\u0275text(7, "dracox");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "small");
        \u0275\u0275text(9, "TRAINING OS");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "div", 5)(11, "span", 6);
        \u0275\u0275text(12, "Espacio personal");
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(13, LoginComponent_Conditional_13_Template, 5, 0, "h1")(14, LoginComponent_Conditional_14_Template, 5, 0, "h1");
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16);
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(17, LoginComponent_Conditional_17_Template, 5, 0, "div", 7)(18, LoginComponent_Conditional_18_Template, 6, 3);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(19, LoginComponent_ng_template_19_Template, 8, 7, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      }
      if (rf & 2) {
        \u0275\u0275advance(13);
        \u0275\u0275conditional(ctx.mode() === "reset" ? 13 : 14);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.subtitle());
        \u0275\u0275advance();
        \u0275\u0275conditional(!ctx.supabaseConfigured ? 17 : 18);
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, NgModel, NgForm, NgTemplateOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ imports: [FormsModule, NgTemplateOutlet], template: `<main class="login-page">\r
  <section class="login-card surface-card">\r
    <div class="brand login-brand">\r
      <span class="brand-mark">D</span>\r
      <span><strong>dracox</strong><small>TRAINING OS</small></span>\r
    </div>\r
\r
    <div class="login-heading">\r
      <span class="eyebrow">Espacio personal</span>\r
      @if (mode() === 'reset') {\r
        <h1>Crea una nueva<br><em>contrase\xF1a segura.</em></h1>\r
      } @else {\r
        <h1>Tu entrenamiento,<br><em>solo para ti.</em></h1>\r
      }\r
      <p>{{ subtitle() }}</p>\r
    </div>\r
\r
    @if (!supabaseConfigured) {\r
      <div class="login-message login-warning">\r
        Falta configurar Supabase. Crea <code>src/assets/supabase-config.json</code> a partir del archivo de ejemplo.\r
      </div>\r
    } @else {\r
      @if (success(); as message) {\r
        <div class="login-message login-success">{{ message }}</div>\r
      }\r
      @if (error(); as message) {\r
        <p class="login-error">{{ message }}</p>\r
      }\r
\r
      @switch (mode()) {\r
        @case ('login') {\r
          <form (ngSubmit)="signIn()">\r
            <label class="field-label">Email\r
              <input type="email" name="email" [(ngModel)]="email" autocomplete="email" required>\r
            </label>\r
            <label class="field-label">Contrase\xF1a\r
              <input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" required>\r
            </label>\r
            <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim() || !password">\r
              {{ busy() ? 'Entrando\u2026' : 'Iniciar sesi\xF3n' }}\r
            </button>\r
            <div class="login-actions">\r
              <button class="login-link" type="button" (click)="setMode('forgot')">\xBFHas olvidado la contrase\xF1a?</button>\r
            </div>\r
            <p class="auth-switch">\xBFNo tienes cuenta? <button class="login-link" type="button" (click)="setMode('register')">Crear cuenta</button></p>\r
          </form>\r
        }\r
\r
        @case ('register') {\r
          <form (ngSubmit)="register()">\r
            <label class="field-label">Nombre\r
              <input type="text" name="displayName" [(ngModel)]="displayName" autocomplete="given-name" maxlength="60">\r
            </label>\r
            <label class="field-label">Email\r
              <input type="email" name="email" [(ngModel)]="email" autocomplete="email" required>\r
            </label>\r
            <ng-container *ngTemplateOutlet="newPassword" />\r
            <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim() || !passwordPairValid()">\r
              {{ busy() ? 'Creando cuenta\u2026' : 'Crear cuenta' }}\r
            </button>\r
            <p class="auth-switch">\xBFYa tienes cuenta? <button class="login-link" type="button" (click)="setMode('login')">Iniciar sesi\xF3n</button></p>\r
          </form>\r
        }\r
\r
        @case ('forgot') {\r
          <form (ngSubmit)="requestReset()">\r
            <label class="field-label">Email\r
              <input type="email" name="email" [(ngModel)]="email" autocomplete="email" required>\r
            </label>\r
            <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim()">\r
              {{ busy() ? 'Enviando\u2026' : 'Enviar enlace' }}\r
            </button>\r
            <p class="auth-switch"><button class="login-link" type="button" (click)="setMode('login')">Volver a iniciar sesi\xF3n</button></p>\r
          </form>\r
        }\r
\r
        @case ('reset') {\r
          <form (ngSubmit)="resetPassword()">\r
            <ng-container *ngTemplateOutlet="newPassword" />\r
            <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !passwordPairValid()">\r
              {{ busy() ? 'Guardando\u2026' : 'Guardar contrase\xF1a' }}\r
            </button>\r
          </form>\r
        }\r
      }\r
    }\r
  </section>\r
</main>\r
\r
<ng-template #newPassword>\r
  <label class="field-label">{{ mode() === 'reset' ? 'Nueva contrase\xF1a' : 'Contrase\xF1a' }}\r
    <input type="password" name="password" [(ngModel)]="password" autocomplete="new-password" [minlength]="minPasswordLength" required>\r
  </label>\r
  <label class="field-label">Repite la contrase\xF1a\r
    <input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" autocomplete="new-password" [minlength]="minPasswordLength" required>\r
  </label>\r
  @if (password && password.length < minPasswordLength) {\r
    <small class="password-hint">Usa al menos {{ minPasswordLength }} caracteres.</small>\r
  }\r
  @if (confirmPassword && password !== confirmPassword) {\r
    <small class="password-hint">Las contrase\xF1as no coinciden.</small>\r
  }\r
</ng-template>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/login/login.component.ts", lineNumber: 23 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-2DYHRJ2R.js.map
