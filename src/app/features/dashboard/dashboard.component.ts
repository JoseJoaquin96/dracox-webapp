import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { WorkoutSession } from '../../domain/models';
import { currentStreak, muscleDistribution, plannedSets, routineExercises, sessionTimestamp, sessionVolume, sessionsSince, startOfWeek, weekActivity } from '../../domain/stats';
import { formatNumber, formatShortDate, plural } from '../../shared/format';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { RoutineStore } from '../../state/routine.store';

const MUSCLE_COLORS = ['var(--orange)', 'var(--violet)', 'var(--green)', '#72b6ff'];

@Component({
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  readonly auth = inject(AuthStore);
  private readonly exercises = inject(ExerciseStore);
  private readonly history = inject(HistoryStore);
  private readonly routines = inject(RoutineStore);
  private readonly now = new Date();

  readonly formatNumber = formatNumber;
  readonly plural = plural;
  readonly plannedSets = plannedSets;
  readonly routineExercises = routineExercises;
  readonly muscleColors = MUSCLE_COLORS;
  readonly streakDots = [0, 1, 2, 3, 4, 5, 6];
  readonly dateLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(this.now);

  readonly nextRoutine = computed(() => this.routines.active()[0] ?? null);
  readonly startLink = computed(() => {
    const routine = this.nextRoutine();
    return routine ? ['/workout', routine.id] : ['/routines'];
  });
  readonly recentSessions = computed(() => this.history.sessions().slice(0, 4));
  readonly weekSessions = computed(() => sessionsSince(this.history.sessions(), startOfWeek(this.now)));
  readonly week = computed(() => weekActivity(this.weekSessions(), this.now));
  readonly weekVolume = computed(() => this.week().reduce((sum, day) => sum + day.volume, 0));
  readonly weekMinutes = computed(() => this.week().reduce((sum, day) => sum + day.minutes, 0));
  readonly maxDayVolume = computed(() => Math.max(...this.week().map((day) => day.volume)));
  readonly maxDayMinutes = computed(() => Math.max(...this.week().map((day) => day.minutes)));
  readonly chartMax = computed(() => Math.max(4, ...this.week().map((day) => day.sessions)));
  readonly yTicks = computed(() => [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(this.chartMax() * ratio * 10) / 10));
  readonly streak = computed(() => currentStreak(this.history.sessions(), this.now));
  readonly muscles = computed(() => muscleDistribution(this.weekSessions(), (id) => this.exercises.byId(id)?.muscle).slice(0, 4));

  volume(session: WorkoutSession): number {
    return sessionVolume(session);
  }

  sessionDate(session: WorkoutSession): string {
    return formatShortDate(sessionTimestamp(session));
  }

  /** Bar size as a percentage of the largest value. */
  percent(value: number, max: number): number {
    return max > 0 ? Math.round(value / max * 100) : 0;
  }
}
