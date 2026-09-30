import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Routine, RoutineDay, WorkoutSet } from '../models';
import { lastPerformance } from '../workout-stats';
import { WorkoutStore } from '../workout.store';

const DEFAULT_REST_SECONDS = 90;

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (session(); as current) {
      <div class="workout-header"><div><button class="back-link" type="button" (click)="saveAndExit()">&lt;- Guardar y salir</button><p class="eyebrow">Sesión en curso · {{ elapsedLabel() }}</p><h1>{{ current.name }}</h1></div><div class="workout-header-actions"><span class="live-pill"><i></i> En directo</span></div></div>
      <div class="workout-layout"><section class="workout-main"><div class="workout-progress-row"><div><strong>{{ completedSets() }} <span>/ {{ totalSets() }} series</span></strong><small>Cada cambio se guarda automáticamente</small></div><span class="progress-track"><i [style.width.%]="progress()"></i></span><strong class="progress-percent">{{ progress() }}%</strong></div>
        @for (exercise of current.exercises; track exercise.id; let index = $index) {
          <article class="exercise-log-card surface-card"><div class="exercise-log-heading"><div class="exercise-title"><span class="exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div><h2>{{ exerciseName(exercise.exerciseId) }}</h2><p>{{ exerciseMeta(exercise.exerciseId) }}</p></div></div></div><div class="previous-line">Último entrenamiento <strong>{{ previousByExercise().get(exercise.exerciseId) ?? 'Sin registro anterior' }}</strong></div><div class="sets-header"><span>SET</span><span>PESO <small>kg</small></span><span>REPS</span><span>OK</span></div>
            @for (set of exercise.sets; track set.id; let setIndex = $index) {
              <div class="set-row" [class.completed]="set.completed"><span class="set-number">{{ setIndex + 1 }}</span><label class="number-field"><input type="number" inputmode="decimal" min="0" step="0.5" [ngModel]="set.weight" (ngModelChange)="updateWeight(exercise.id, set.id, $event)" placeholder="-" [attr.aria-label]="'Peso de la serie ' + (setIndex + 1)"/><small>kg</small></label><label class="number-field reps-field"><input type="number" inputmode="numeric" min="0" step="1" [ngModel]="set.reps" (ngModelChange)="updateReps(exercise.id, set.id, $event)" placeholder="-" [attr.aria-label]="'Repeticiones de la serie ' + (setIndex + 1)"/><small>{{ set.target }}</small></label><button class="check-set" type="button" [class.checked]="set.completed" (click)="completeSet(exercise.id, exercise.exerciseId, set)" [attr.aria-label]="set.completed ? 'Desmarcar serie' : 'Completar serie'">{{ set.completed ? 'OK' : '○' }}</button></div>
            }
            <div class="exercise-card-footer"><button class="add-set-button" type="button" (click)="store.addSet(exercise.id)">+ Añadir serie</button><span>Descanso recomendado {{ formatTime(restSecondsFor(exercise.exerciseId)) }}</span></div>
          </article>
        }
      </section><aside class="workout-aside"><article class="timer-card surface-card"><span class="eyebrow">Descanso</span><strong role="timer" aria-live="off">{{ restLabel() }}</strong><p>{{ restRunning() ? 'Recupera lo suficiente. Vuelve más fuerte.' : 'Se inicia solo al completar una serie.' }}</p><div class="timer-actions"><button type="button" (click)="adjustRest(-15)">- 15s</button><button type="button" class="timer-main" (click)="toggleRest()">{{ restRunning() ? 'Pausar' : restSeconds() > 0 ? 'Continuar' : 'Iniciar' }}</button><button type="button" (click)="adjustRest(15)">+ 15s</button></div></article><article class="coach-card surface-card"><span class="coach-icon">*</span><div><strong>Hoy toca consistencia</strong><p>Tu mejor serie es la que registras. El resto lo construye el tiempo.</p></div></article><button class="button button-outline" type="button" (click)="saveAndExit()">Guardar y salir</button><button class="finish-button" type="button" (click)="finish()">Finalizar entrenamiento <span>OK</span></button></aside></div>
    } @else if (anotherActiveSession()) {
      <div class="empty-state surface-card"><span>!</span><h2>Ya tienes una sesión activa</h2><p>Guárdala o termínala antes de empezar otro día.</p><button class="button button-primary" type="button" (click)="resumeActive()">Continuar sesión</button><button class="button button-outline" type="button" (click)="goToRoutines()">Volver a rutinas</button></div>
    } @else if (routine(); as planned) {
      <div class="empty-state surface-card"><button class="back-link" type="button" (click)="goToRoutines()">&lt;- Volver a rutinas</button><span>+</span><h2>{{ planned.name }}</h2><p>{{ routineDay()?.name ?? planned.days }}</p><small>La sesión aún no ha comenzado. Pulsa el botón cuando estés preparado.</small><div class="preview-exercise-list">@for (exercise of routineDay()?.exercises ?? []; track $index; let index = $index) {<div class="preview-exercise-row"><span class="exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div><strong>{{ exerciseName(exercise.exerciseId) }}</strong><small>{{ exerciseMeta(exercise.exerciseId) }}</small></div><span class="preview-exercise-target">{{ exercise.sets }} series · {{ exercise.repRange }} reps · {{ exercise.restSeconds }} s</span></div>} @empty {<p>Este día no tiene ejercicios configurados.</p>}</div><button class="button button-primary" type="button" (click)="start()">Iniciar sesión</button></div>
    } @else {
      <div class="empty-state surface-card"><span>*</span><h2>No se encontró la rutina</h2><p>Vuelve a rutinas y selecciona un día válido.</p><button class="button button-primary" type="button" (click)="goToRoutines()">Ver rutinas</button></div>
    }
  `
})
export class WorkoutComponent implements OnDestroy {
  readonly store = inject(WorkoutStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly routineId = computed(() => this.params().get('routineId') ?? '');
  readonly routineDayId = computed(() => this.params().get('routineDayId'));
  readonly routine = computed<Routine | null>(() => this.store.routineById(this.routineId()) ?? null);
  readonly routineDay = computed<RoutineDay | null>(() => {
    const days = this.routine()?.routineDays ?? [];
    return days.find((day) => day.id === this.routineDayId()) ?? days[0] ?? null;
  });
  readonly session = computed(() => {
    const active = this.store.activeSession();
    if (!active || active.routineId !== this.routineId()) return null;
    const routineDayId = this.routineDayId();
    if (routineDayId && active.routineDayId !== routineDayId) return null;
    return active;
  });
  readonly anotherActiveSession = computed(() => this.store.activeSession() !== null && this.session() === null);
  readonly completedSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0) ?? 0);
  readonly totalSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0) ?? 0);
  readonly progress = computed(() => this.totalSets() ? Math.round(this.completedSets() / this.totalSets() * 100) : 0);
  readonly previousByExercise = computed(() => {
    const session = this.session();
    const sessions = this.store.sessions();
    const labels = new Map<string, string | null>();
    session?.exercises.forEach((exercise) => labels.set(exercise.exerciseId, lastPerformance(sessions, exercise.exerciseId, session.id)));
    return labels;
  });
  private readonly plannedRest = computed(() => {
    const session = this.session();
    const routine = session ? this.store.routineById(session.routineId) : undefined;
    const day = routine?.routineDays?.find((item) => item.id === session?.routineDayId)
      ?? routine?.routineDays?.find((item) => item.name === session?.dayName);
    return new Map((day?.exercises ?? routine?.exercises ?? []).map((exercise) => [exercise.exerciseId, exercise.restSeconds]));
  });

  private readonly now = signal(Date.now());
  readonly elapsedSeconds = computed(() => {
    const startedAt = this.session()?.startedAt;
    return startedAt ? Math.max(0, Math.floor((this.now() - new Date(startedAt).getTime()) / 1000)) : 0;
  });
  // Rest is tracked as an end timestamp so it stays accurate if the tab is throttled.
  private readonly restEndsAt = signal<number | null>(null);
  private readonly restPausedSeconds = signal(0);
  private lastRestSeconds = DEFAULT_REST_SECONDS;
  readonly restSeconds = computed(() => {
    const endsAt = this.restEndsAt();
    return endsAt === null ? this.restPausedSeconds() : Math.max(0, Math.ceil((endsAt - this.now()) / 1000));
  });
  readonly restRunning = computed(() => this.restEndsAt() !== null);
  readonly elapsedLabel = computed(() => this.formatTime(this.elapsedSeconds()));
  readonly restLabel = computed(() => this.formatTime(this.restSeconds()));
  private readonly timerId: ReturnType<typeof setInterval>;

  constructor() {
    this.timerId = setInterval(() => {
      this.now.set(Date.now());
      if (this.restRunning() && this.restSeconds() === 0) this.finishRest();
    }, 1000);
  }

  ngOnDestroy(): void { clearInterval(this.timerId); }

  async start(): Promise<void> {
    await this.store.startWorkout(this.routineId(), this.routineDayId() ?? undefined);
  }

  async saveAndExit(): Promise<void> {
    if (this.session()) await this.store.saveWorkout();
    await this.goToRoutines();
  }

  async finish(): Promise<void> {
    if (await this.store.finishWorkout()) await this.router.navigate(['/progress']);
  }

  async resumeActive(): Promise<void> {
    const active = this.store.activeSession();
    if (!active) return;
    await this.router.navigate(active.routineDayId ? ['/workout', active.routineId, active.routineDayId] : ['/workout', active.routineId]);
  }

  async goToRoutines(): Promise<void> { await this.router.navigate(['/routines']); }
  exerciseName(id: string): string { return this.store.exerciseById(id)?.name ?? 'Ejercicio'; }
  exerciseMeta(id: string): string { const exercise = this.store.exerciseById(id); return exercise ? `${exercise.muscle} - ${exercise.equipment}` : ''; }
  restSecondsFor(exerciseId: string): number { return this.plannedRest().get(exerciseId) ?? DEFAULT_REST_SECONDS; }
  updateWeight(exerciseId: string, setId: string, value: number | null): void { this.store.updateSet(exerciseId, setId, { weight: this.toMeasure(value) }); }
  updateReps(exerciseId: string, setId: string, value: number | null): void { this.store.updateSet(exerciseId, setId, { reps: this.toMeasure(value, true) }); }

  completeSet(sessionExerciseId: string, exerciseId: string, set: WorkoutSet): void {
    const completing = !set.completed;
    this.store.toggleSet(sessionExerciseId, set.id);
    if (completing) this.startRest(this.restSecondsFor(exerciseId));
  }

  toggleRest(): void {
    if (this.restRunning()) {
      this.restPausedSeconds.set(this.restSeconds());
      this.restEndsAt.set(null);
      return;
    }
    this.startRest(this.restSeconds() > 0 ? this.restSeconds() : this.lastRestSeconds);
  }

  adjustRest(amount: number): void {
    const endsAt = this.restEndsAt();
    if (endsAt === null) {
      this.restPausedSeconds.update((seconds) => Math.max(0, seconds + amount));
      return;
    }
    this.restEndsAt.set(Math.max(Date.now(), endsAt + amount * 1000));
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  private startRest(seconds: number): void {
    if (seconds <= 0) return;
    this.lastRestSeconds = seconds;
    this.now.set(Date.now());
    this.restEndsAt.set(Date.now() + seconds * 1000);
  }

  private finishRest(): void {
    this.restEndsAt.set(null);
    this.restPausedSeconds.set(0);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  }

  private toMeasure(value: number | string | null | undefined, integer = false): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return null;
    return integer ? Math.round(parsed) : parsed;
  }
}
