import { Component, DestroyRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutineDay, WorkoutSet } from '../../domain/models';
import { lastPerformance, routineExercises } from '../../domain/stats';
import { formatClock, formatPosition } from '../../shared/format';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { RoutineStore } from '../../state/routine.store';
import { WorkoutStore } from '../../state/workout.store';
import { RestTimerComponent } from './rest-timer.component';

const DEFAULT_REST_SECONDS = 90;

@Component({
  imports: [FormsModule, RestTimerComponent],
  templateUrl: './workout.component.html'
})
export class WorkoutComponent {
  // Bound from the route parameters.
  readonly routineId = input.required<string>();
  readonly routineDayId = input<string>();

  readonly workout = inject(WorkoutStore);
  readonly exercises = inject(ExerciseStore);
  private readonly routines = inject(RoutineStore);
  private readonly history = inject(HistoryStore);
  private readonly router = inject(Router);
  private readonly restTimer = viewChild(RestTimerComponent);
  private readonly now = signal(Date.now());
  readonly formatClock = formatClock;
  readonly formatPosition = formatPosition;

  readonly routine = computed(() => this.routines.byId(this.routineId()) ?? null);
  readonly routineDay = computed<RoutineDay | null>(() => {
    const days = this.routine()?.days ?? [];
    return days.find((day) => day.id === this.routineDayId()) ?? days[0] ?? null;
  });
  /** The active session, if it belongs to this routine (and day, when one is given). */
  readonly session = computed(() => {
    const active = this.workout.active();
    if (!active || active.routineId !== this.routineId()) return null;
    const dayId = this.routineDayId();
    return !dayId || active.routineDayId === dayId ? active : null;
  });
  readonly otherSessionActive = computed(() => this.workout.active() !== null && this.session() === null);

  readonly totalSets = computed(() => this.allSets().length);
  readonly completedSets = computed(() => this.allSets().filter((set) => set.completed).length);
  readonly progress = computed(() => this.totalSets() ? Math.round(this.completedSets() / this.totalSets() * 100) : 0);
  readonly elapsed = computed(() => {
    const startedAt = this.session()?.startedAt;
    return formatClock(startedAt ? Math.max(0, Math.floor((this.now() - Date.parse(startedAt)) / 1000)) : 0);
  });
  readonly previousPerformance = computed(() => {
    const sessions = this.history.sessions();
    return new Map(this.session()?.exercises.map((exercise) => [exercise.exerciseId, lastPerformance(sessions, exercise.exerciseId)]));
  });
  private readonly plannedRest = computed(() => {
    const session = this.session();
    const routine = session ? this.routines.byId(session.routineId) : undefined;
    if (!session || !routine) return new Map<string, number>();
    const day = routine.days.find((item) => item.id === session.routineDayId) ?? routine.days.find((item) => item.name === session.dayName);
    const planned = day?.exercises ?? routineExercises(routine);
    return new Map(planned.map((exercise) => [exercise.exerciseId, exercise.restSeconds]));
  });
  private readonly allSets = computed(() => this.session()?.exercises.flatMap((exercise) => exercise.sets) ?? []);

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  restFor(exerciseId: string): number {
    return this.plannedRest().get(exerciseId) ?? DEFAULT_REST_SECONDS;
  }

  start(): void {
    void this.workout.start(this.routineId(), this.routineDayId());
  }

  async saveAndExit(): Promise<void> {
    if (this.session()) await this.workout.save();
    await this.goToRoutines();
  }

  async goToRoutines(): Promise<void> {
    await this.router.navigate(['/routines']);
  }

  async finish(): Promise<void> {
    if (await this.workout.finish()) await this.router.navigate(['/progress']);
  }

  resumeActive(): void {
    const active = this.workout.active();
    if (active) void this.router.navigate(['/workout', active.routineId, ...(active.routineDayId ? [active.routineDayId] : [])]);
  }

  setWeight(setId: string, value: unknown): void {
    this.workout.updateSet(setId, { weight: toMeasure(value) });
  }

  setReps(setId: string, value: unknown): void {
    const reps = toMeasure(value);
    this.workout.updateSet(setId, { reps: reps === null ? null : Math.round(reps) });
  }

  toggleSet(exerciseId: string, set: WorkoutSet): void {
    this.workout.toggleSet(set.id);
    if (!set.completed) this.restTimer()?.start(this.restFor(exerciseId));
  }
}

/** Empty or invalid input means "not recorded". */
function toMeasure(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
