import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    @if (session(); as current) {
      <div class="workout-header"><div><a class="back-link" routerLink="/routines">← Volver a rutinas</a><p class="eyebrow">Sesión en curso · {{ elapsedLabel() }}</p><h1>{{ current.name }}</h1></div><div class="workout-header-actions"><span class="live-pill"><i></i> En directo</span><button class="icon-button">•••</button></div></div>
      <div class="workout-layout"><main class="workout-main"><div class="workout-progress-row"><div><strong>{{ completedSets() }} <span>/ {{ totalSets() }} series</span></strong><small>Completa cada serie a tu ritmo</small></div><span class="progress-track"><i [style.width.%]="progress()"></i></span><strong class="progress-percent">{{ progress() }}%</strong></div>
        @for (exercise of current.exercises; track exercise.id; let index = $index) {
          <article class="exercise-log-card surface-card"><div class="exercise-log-heading"><div class="exercise-title"><span class="exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div><h2>{{ exerciseName(exercise.exerciseId) }}</h2><p>{{ exerciseMeta(exercise.exerciseId) }}</p></div></div><button class="ghost-icon">•••</button></div><div class="previous-line">Último entrenamiento <strong>{{ previousLabel(exercise.exerciseId) }}</strong><span>↗</span></div><div class="sets-header"><span>SET</span><span>PESO <small>kg</small></span><span>REPS</span><span>OK</span></div>
            @for (set of exercise.sets; track set.id; let setIndex = $index) {
              <div class="set-row" [class.completed]="set.completed"><span class="set-number">{{ setIndex + 1 }}</span><label class="number-field"><input type="number" [ngModel]="set.weight" (ngModelChange)="updateWeight(exercise.id, set.id, $event)" placeholder="—"><small>kg</small></label><label class="number-field reps-field"><input type="number" [ngModel]="set.reps" (ngModelChange)="updateReps(exercise.id, set.id, $event)" placeholder="—"><small>{{ set.target }}</small></label><button class="check-set" [class.checked]="set.completed" (click)="store.toggleSet(exercise.id, set.id)" [attr.aria-label]="set.completed ? 'Desmarcar serie' : 'Completar serie'">{{ set.completed ? '✓' : '○' }}</button></div>
            }
            <div class="exercise-card-footer"><button class="add-set-button" (click)="store.addSet(exercise.id)">＋ Añadir serie</button><span>Descanso recomendado {{ restFor(exercise.exerciseId) }}</span></div>
          </article>
        }
      </main><aside class="workout-aside"><article class="timer-card surface-card"><span class="eyebrow">Descanso</span><strong>{{ restLabel() }}</strong><p>Recupera lo suficiente. Vuelve más fuerte.</p><div class="timer-actions"><button (click)="adjustRest(-15)">− 15s</button><button class="timer-main" (click)="toggleRest()">{{ restRunning() ? 'Pausar' : 'Continuar' }}</button><button (click)="adjustRest(15)">+ 15s</button></div></article><article class="coach-card surface-card"><span class="coach-icon">✳</span><div><strong>Hoy toca consistencia</strong><p>Tu mejor serie es la que registras. El resto lo construye el tiempo.</p></div></article><button class="finish-button" (click)="finish()">Finalizar entrenamiento <span>✓</span></button></aside></div>
    } @else { <div class="empty-state surface-card"><span>✦</span><h2>No hay una sesión activa</h2><p>Elige una rutina para empezar a entrenar.</p><a class="button button-primary" routerLink="/routines">Ver rutinas</a></div> }
  `
})
export class WorkoutComponent implements OnDestroy {
  readonly store = inject(WorkoutStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly session = this.store.activeSession;
  readonly completedSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0) ?? 0);
  readonly totalSets = computed(() => this.session()?.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0) ?? 0);
  readonly progress = computed(() => this.totalSets() ? Math.round(this.completedSets() / this.totalSets() * 100) : 0);
  readonly elapsedSeconds = signal(1122);
  readonly restSeconds = signal(92);
  readonly restRunning = signal(true);
  readonly elapsedLabel = computed(() => this.formatTime(this.elapsedSeconds()));
  readonly restLabel = computed(() => this.formatTime(this.restSeconds()));
  private readonly timerId: ReturnType<typeof setInterval>;

  constructor() {
    const routineId = this.route.snapshot.paramMap.get('routineId');
    if (routineId) {
      const active = this.store.startWorkout(routineId);
      if (active) this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - new Date(active.startedAt).getTime()) / 1000)));
    }
    this.timerId = setInterval(() => {
      this.elapsedSeconds.update((seconds) => seconds + 1);
      if (this.restRunning()) this.restSeconds.update((seconds) => Math.max(0, seconds - 1));
    }, 1000);
  }

  ngOnDestroy(): void { clearInterval(this.timerId); }

  exerciseName(id: string): string { return this.store.exerciseById(id)?.name ?? 'Ejercicio'; }
  exerciseMeta(id: string): string { const exercise = this.store.exerciseById(id); return exercise ? `${exercise.muscle} · ${exercise.equipment}` : ''; }
  previousLabel(id: string): string { const exercise = this.store.exerciseById(id); return exercise?.kind === 'timed' ? '45 s · 45 s · 45 s' : '80 kg × 8 · 80 kg × 8 · 82,5 kg × 6'; }
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
  finish(): void { this.store.finishWorkout(); void this.router.navigate(['/progress']); }
}
