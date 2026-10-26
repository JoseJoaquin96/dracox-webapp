import {
  completedSetCount,
  formatSetResult,
  sessionTimestamp,
  sessionVolume
} from "./chunk-WJTWJKEM.js";
import {
  ModalComponent
} from "./chunk-7CSBVKAK.js";
import {
  ExerciseStore
} from "./chunk-IRFOAOFN.js";
import {
  formatNumber
} from "./chunk-OKXU5PZQ.js";
import {
  Component,
  Input,
  Output,
  computed,
  inject,
  input,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-2MVRL4DM.js";

// src/app/shared/session-detail.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SessionDetailComponent_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const session_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(session_r1.name);
  }
}
function SessionDetailComponent_For_2_For_16_For_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const set_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275nextContext();
    const exercise_r3 = \u0275\u0275readContextLet(0);
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.formatSetResult(set_r2, exercise_r3 == null ? null : exercise_r3.kind));
  }
}
function SessionDetailComponent_For_2_For_16_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SessionDetailComponent_For_2_For_16_For_9_Conditional_0_Template, 2, 1, "span");
  }
  if (rf & 2) {
    const set_r2 = ctx.$implicit;
    \u0275\u0275conditional(set_r2.completed ? 0 : -1);
  }
}
function SessionDetailComponent_For_2_For_16_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "Sin series completadas");
    \u0275\u0275elementEnd();
  }
}
function SessionDetailComponent_For_2_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "div", 4)(2, "span", 5);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 6);
    \u0275\u0275repeaterCreate(8, SessionDetailComponent_For_2_For_16_For_9_Template, 1, 1, null, null, _forTrack0);
    \u0275\u0275conditionalCreate(10, SessionDetailComponent_For_2_For_16_Conditional_10_Template, 2, 0, "small");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const \u0275$index_30_r6 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(2);
    const exercise_r7 = \u0275\u0275storeLet(ctx_r3.exercises.byId(item_r5.exerciseId));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275$index_30_r6 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((exercise_r7 == null ? null : exercise_r7.name) ?? "Ejercicio");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(item_r5.sets);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r3.hasCompleted(item_r5.sets) ? 10 : -1);
  }
}
function SessionDetailComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1);
    \u0275\u0275conditionalCreate(1, SessionDetailComponent_For_2_Conditional_1_Template, 2, 1, "h3");
    \u0275\u0275elementStart(2, "div", 3)(3, "span")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " min");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span")(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " series");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span")(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " kg");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(15, SessionDetailComponent_For_2_For_16_Template, 11, 4, "div", 4, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const session_r1 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.sessions().length > 1 ? 1 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(session_r1.durationMinutes ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.setCount(session_r1));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.formatNumber(ctx_r3.volume(session_r1)));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(session_r1.exercises);
  }
}
function SessionDetailComponent_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "No hay detalles cargados para este d\xEDa.");
    \u0275\u0275elementEnd();
  }
}
var longDate = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });
var SessionDetailComponent = class _SessionDetailComponent {
  constructor() {
    this.sessions = input.required(...ngDevMode ? [{ debugName: "sessions" }] : (
      /* istanbul ignore next */
      []
    ));
    this.closed = output();
    this.exercises = inject(ExerciseStore);
    this.formatNumber = formatNumber;
    this.formatSetResult = formatSetResult;
    this.volume = sessionVolume;
    this.setCount = completedSetCount;
    this.dateLabel = computed(() => {
      const first = this.sessions()[0];
      return first ? longDate.format(new Date(sessionTimestamp(first))) : "";
    }, ...ngDevMode ? [{ debugName: "dateLabel" }] : (
      /* istanbul ignore next */
      []
    ));
    this.heading = computed(() => {
      const sessions = this.sessions();
      if (sessions.length > 1)
        return `${sessions.length} entrenamientos`;
      const session = sessions[0];
      if (!session)
        return "Entrenamiento";
      return session.dayName && session.dayName !== session.name ? `${session.name} \xB7 ${session.dayName}` : session.name;
    }, ...ngDevMode ? [{ debugName: "heading" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  hasCompleted(sets) {
    return sets.some((set) => set.completed);
  }
  static {
    this.\u0275fac = function SessionDetailComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SessionDetailComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SessionDetailComponent, selectors: [["dracox-session-detail"]], inputs: { sessions: [1, "sessions"] }, outputs: { closed: "closed" }, decls: 4, vars: 3, consts: [["panelClass", "session-detail-modal", 3, "closed", "eyebrow", "heading"], [1, "session-detail"], [1, "metric-foot"], [1, "session-detail-stats"], [1, "session-detail-exercise"], [1, "exercise-number"], [1, "set-chips"]], template: function SessionDetailComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "dracox-modal", 0);
        \u0275\u0275listener("closed", function SessionDetailComponent_Template_dracox_modal_closed_0_listener() {
          return ctx.closed.emit();
        });
        \u0275\u0275repeaterCreate(1, SessionDetailComponent_For_2_Template, 17, 4, "section", 1, _forTrack0, false, SessionDetailComponent_ForEmpty_3_Template, 2, 0, "p", 2);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("eyebrow", ctx.dateLabel())("heading", ctx.heading());
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.sessions());
      }
    }, dependencies: [ModalComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionDetailComponent, [{
    type: Component,
    args: [{
      selector: "dracox-session-detail",
      imports: [ModalComponent],
      template: `
    <dracox-modal panelClass="session-detail-modal" [eyebrow]="dateLabel()" [heading]="heading()" (closed)="closed.emit()">
      @for (session of sessions(); track session.id) {
        <section class="session-detail">
          @if (sessions().length > 1) { <h3>{{ session.name }}</h3> }
          <div class="session-detail-stats">
            <span><strong>{{ session.durationMinutes ?? 0 }}</strong> min</span>
            <span><strong>{{ setCount(session) }}</strong> series</span>
            <span><strong>{{ formatNumber(volume(session)) }}</strong> kg</span>
          </div>
          @for (item of session.exercises; track item.id; let index = $index) {
            @let exercise = exercises.byId(item.exerciseId);
            <div class="session-detail-exercise">
              <span class="exercise-number">{{ index + 1 }}</span>
              <div>
                <strong>{{ exercise?.name ?? 'Ejercicio' }}</strong>
                <div class="set-chips">
                  @for (set of item.sets; track set.id) {
                    @if (set.completed) { <span>{{ formatSetResult(set, exercise?.kind) }}</span> }
                  }
                  @if (!hasCompleted(item.sets)) { <small>Sin series completadas</small> }
                </div>
              </div>
            </div>
          }
        </section>
      } @empty {
        <p class="metric-foot">No hay detalles cargados para este d\xEDa.</p>
      }
    </dracox-modal>
  `
    }]
  }], null, { sessions: [{ type: Input, args: [{ isSignal: true, alias: "sessions", required: true }] }], closed: [{ type: Output, args: ["closed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SessionDetailComponent, { className: "SessionDetailComponent", filePath: "src/app/shared/session-detail.component.ts", lineNumber: 46 });
})();

export {
  SessionDetailComponent
};
//# sourceMappingURL=chunk-PZZ75RQ2.js.map
