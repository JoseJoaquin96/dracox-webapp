import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Routine, RoutineDay } from '../models';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (session(); as current) {
      <div class="workout-header"><div><button class="back-link" type="button" (click)="saveAndExit()">&lt;- Guardar y salir</button><p class="eyebrow">Sesion en curso · {{ elapsedLabel() }}</p><h1>{{ current.name }}</h1></div><div class="workout-header-actions"><span class="live-pill"><i></i> En directo</span><button class="icon-button">...</button></div></div>
      <div class="workout-layout"><main class="workout-main"><div class="workout-progress-row"><div><strong>{{ completedSets() }} <span>/ {{ totalSets() }} series</span></strong><small>Cada cambio se guarda en Supabase</small></div><span class="progress-track"><i [style.width.%]="progress()"></i></span><strong class="progress-percent">{{ progress() }}%</strong></div>
        @for (exercise of current.exercises; track exercise.id; let index = $index) {
          <article class="exercise-log-card surface-card"><div class="exercise-log-heading"><div class="exercise-title"><span class="exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div><h2>{{ exerciseName(exercise.exerciseId) }}</h2><p>{{ exerciseMeta(exercise.exerciseId) }}</p></div></div><button class="ghost-icon">...</button></div><div class="previous-line">Ultimo entrenamiento <strong>{{ previousLabel(exercise.exerciseId) }}</strong><span>-></span></div><div class="sets-header"><span>SET</span><span>PESO <small>kg</small></span><span>REPS</span><span>OK</span></div>
            @for (set of exercise.sets; track set.id; let setIndex = $index) {
              <div class="set-row" [class.completed]="set.completed"><span class="set-number">{{ setIndex + 1 }}</span><label class="number-field"><input type="number" [ngModel]="set.weight" (ngModelChange)="updateWeight(exercise.id, set.id, $event)" placeholder="-"/><small>kg</small></label><label class="number-field reps-field"><input type="number" [ngModel]="set.reps" (ngModelChange)="updateReps(exercise.id, set.id, $event)" placeholder="-"/><small>{{ set.target }}</small></label><button class="check-set" [class.checked]="set.completed" (click)="store.toggleSet(exercise.id, set.id)" [attr.aria-label]="set.completed ? 'Desmarcar serie' : 'Completar serie'">{{ set.completed ? 'OK' : '○' }}</button></div>
            }
            <div class="exercise-card-footer"><button class="add-set-button" (click)="store.addSet(exercise.id)">+ Anadir serie</button><span>Descanso recomendado {{ restFor(exercise.exerciseId) }}</span></div>
          </article>
        }
      </main><aside class="workout-aside"><article class="timer-card surface-card"><span class="eyebrow">Descanso</span><strong>{{ restLabel() }}</strong><p>Recupera lo suficiente. Vuelve mas fuerte.</p><div class="timer-actions"><button (click)="adjustRest(-15)">- 15s</button><button class="timer-main" (click)="toggleRest()">{{ restRunning() ? 'Pausar' : 'Continuar' }}</button><button (click)="adjustRest(15)">+ 15s</button></div></article><article class="coach-card surface-card"><span class="coach-icon">*</span><div><strong>Hoy toca consistencia</strong><p>Tu mejor serie es la que registras. El resto lo construye el tiempo.</p></div></article><button class="button button-outline" type="button" (click)="saveAndExit()">Guardar y salir</button><button class="finish-button" (click)="finish()">Finalizar entrenamiento <span>OK</span></button></aside></div>
    } @else if (anotherActiveSession()) {
      <div class="empty-state surface-card"><span>!</span><h2>Ya tienes una sesion activa</h2><p>Guardala o terminala antes de empezar otro dia.</p><button class="button button-primary" type="button" (click)="resumeActive()">Continuar sesion</button><button class="button button-outline" type="button" (click)="goToRoutines()">Volver a rutinas</button></div>
    } @else if (routine(); as planned) {
      <div class="empty-state surface-card"><button class="back-link" type="button" (click)="goToRoutines()">&lt;- Volver a rutinas</button><span>+</span><h2>{{ planned.name }}</h2><p>{{ routineDay()?.name ?? planned.days }}</p><small>La sesion aun no ha comenzado. Pulsa el boton cuando estes preparado.</small><div class="preview-exercise-list">@for (exercise of routineDay()?.exercises ?? []; track $index; let index = $index) {<div class="preview-exercise-row"><span class="exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div><strong>{{ exerciseName(exercise.exerciseId) }}</strong><small>{{ exerciseMeta(exercise.exerciseId) }}</small></div><span class="preview-exercise-target">{{ exercise.sets }} series · {{ exercise.repRange }} reps · {{ exercise.restSeconds }} s</span></div>} @empty {<p>Este dia no tiene ejercicios configurados.</p>}</div><button class="button button-primary" type="button" (click)="start()">Iniciar sesion</button></div>
    } @else {
      <div class="empty-state surface-card"><span>*</span><h2>No se encontro la rutina</h2><p>Vuelve a rutinas y selecciona un dia valido.</p><button class="button button-primary" type="button" (click)="goToRoutines()">Ver rutinas</button></div>
    }
  `
})
export class WorkoutComponent implements OnDestroy {
  readonly store = inject(WorkoutStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly routineId = this.route.snapshot.paramMap.get('routineId') ?? '';
  readonly routineDayId = this.route.snapshot.paramMap.get('routineDayId');
  readonly routine = computed<Routine | null>(() => this.store.routineById(this.routineId) ?? null);
  readonly routineDay = computed<RoutineDay | null>(() => {
    const days = this.routine()?.routineDays ?? [];
    return days.find((day) => day.id === this.routineDayId) ?? days[0] ?? null;
  });
  readonly session = computed(() => {
    const active = this.store.activeSession();
    if (!active || active.routineId !== this.routineId) return null;
    if (this.routineDayId && active.routineDayId !== this.routineDayId) return null;
    return active;
  });
  readonly anotherActiveSession = computed(() => this.store.activeSession() !== null && this.session() === null);
  readonly completedSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0) ?? 0);
  readonly totalSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0) ?? 0);
  readonly progress = computed(() => this.totalSets() ? Math.round(this.completedSets() / this.totalSets() * 100) : 0);
  readonly elapsedSeconds = signal(0);
  readonly restSeconds = signal(92);
  readonly restRunning = signal(true);
  readonly elapsedLabel = computed(() => this.formatTime(this.elapsedSeconds()));
  readonly restLabel = computed(() => this.formatTime(this.restSeconds()));
  private readonly timerId: ReturnType<typeof setInterval>;

  constructor() {
    this.timerId = setInterval(() => {
      if (this.session()) this.elapsedSeconds.update((seconds) => seconds + 1);
      if (this.restRunning()) this.restSeconds.update((seconds) => Math.max(0, seconds - 1));
    }, 1000);
  }

  ngOnDestroy(): void { clearInterval(this.timerId); }

  async start(): Promise<void> {
    const active = await this.store.startWorkout(this.routineId, this.routineDayId ?? undefined);
    if (active) this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - new Date(active.startedAt).getTime()) / 1000)));
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
  previousLabel(id: string): string { const exercise = this.store.exerciseById(id); return exercise?.kind === 'timed' ? '45 s - 45 s - 45 s' : 'Sin registro anterior'; }
  restFor(id: string): string { return this.store.exerciseById(id)?.muscle === 'Piernas' ? '2:30' : '1:30'; }
  updateWeight(exerciseId: string, setId: string, value: number | null): void { this.store.updateSet(exerciseId, setId, { weight: value === null || value === undefined ? null : Number(value) }); }
  updateReps(exerciseId: string, setId: string, value: number | null): void { this.store.updateSet(exerciseId, setId, { reps: value === null || value === undefined ? null : Number(value) }); }
  toggleRest(): void { this.restRunning.update((running) => !running); }
  adjustRest(amount: number): void { this.restSeconds.update((seconds) => Math.max(0, seconds + amount)); }
  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
