import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { WorkoutSession } from '../../domain/models';
import { completedSetCount, localDayKey, muscleDistribution, nextRoutineDay, sessionTimestamp, sessionVolume, sessionsSince, startOfWeek, weekActivity } from '../../domain/stats';
import { formatNumber, formatShortDate, plural } from '../../shared/format';
import { SessionDetailComponent } from '../../shared/session-detail.component';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { RoutineStore } from '../../state/routine.store';
import { WorkoutStore } from '../../state/workout.store';

const MUSCLE_COLORS = ['var(--orange)', 'var(--violet)', 'var(--green)', '#72b6ff'];
const PREVIEW_EXERCISES = 4;

interface WeekTotals {
  sessions: number;
  sets: number;
  volume: number;
  minutes: number;
}

@Component({
  imports: [RouterLink, SessionDetailComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  readonly auth = inject(AuthStore);
  readonly exercises = inject(ExerciseStore);
  private readonly history = inject(HistoryStore);
  private readonly routines = inject(RoutineStore);
  private readonly now = new Date();

  readonly formatNumber = formatNumber;
  readonly plural = plural;
  readonly muscleColors = MUSCLE_COLORS;
  readonly previewCount = PREVIEW_EXERCISES;
  readonly dateLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(this.now);

  /** Sessions shown in the detail modal; null when it is closed. */
  readonly detail = signal<WorkoutSession[] | null>(null);

  readonly activeSession = inject(WorkoutStore).active;
  // The routine trained most recently, if still active; otherwise the first one.
  readonly nextRoutine = computed(() => {
    const active = this.routines.active();
    const lastRoutineId = this.history.sessions()[0]?.routineId;
    return active.find((routine) => routine.id === lastRoutineId) ?? active[0] ?? null;
  });
  readonly nextDay = computed(() => {
    const routine = this.nextRoutine();
    return routine ? nextRoutineDay(routine, this.history.sessions()) : null;
  });
  readonly nextDaySets = computed(() => this.nextDay()?.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) ?? 0);
  readonly nextDayLastDone = computed(() => {
    const dayId = this.nextDay()?.id;
    const session = dayId ? this.history.sessions().find((item) => item.routineDayId === dayId) : undefined;
    return session ? formatShortDate(sessionTimestamp(session)) : null;
  });
  readonly startLink = computed(() => {
    const active = this.activeSession();
    if (active) return ['/workout', active.routineId, ...(active.routineDayId ? [active.routineDayId] : [])];
    const routine = this.nextRoutine();
    if (!routine) return ['/routines'];
    const dayId = this.nextDay()?.id;
    return ['/workout', routine.id, ...(dayId ? [dayId] : [])];
  });

  readonly recentSessions = computed(() => this.history.sessions().slice(0, 5));
  readonly weekSessions = computed(() => sessionsSince(this.history.sessions(), startOfWeek(this.now)));
  readonly thisWeek = computed(() => totals(this.weekSessions()));
  readonly lastWeek = computed(() => {
    const monday = startOfWeek(this.now);
    const previousMonday = new Date(monday);
    previousMonday.setDate(monday.getDate() - 7);
    return totals(sessionsSince(this.history.sessions(), previousMonday).filter((session) => new Date(sessionTimestamp(session)) < monday));
  });
  /** 0 = this week, -1 = last week… */
  readonly weekOffset = signal(0);
  private readonly viewedWeekStart = computed(() => {
    const monday = startOfWeek(this.now);
    monday.setDate(monday.getDate() + this.weekOffset() * 7);
    return monday;
  });
  readonly weekRangeLabel = computed(() => {
    const start = this.viewedWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${formatShortDate(start)} – ${formatShortDate(end)}`;
  });
  readonly week = computed(() => weekActivity(this.history.sessions(), this.viewedWeekStart(), this.now).map((day) => ({
    ...day,
    sessionsOfDay: this.history.sessions().filter((session) => localDayKey(sessionTimestamp(session)) === day.key)
  })));
  readonly maxDayVolume = computed(() => Math.max(...this.week().map((day) => day.volume)));
  readonly muscles = computed(() => muscleDistribution(this.weekSessions(), (id) => this.exercises.byId(id)?.muscle).slice(0, 4));

  moveWeek(offset: -1 | 1): void {
    this.weekOffset.update((value) => Math.min(0, value + offset));
    void this.history.loadUntil(this.viewedWeekStart());
  }

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

function totals(sessions: WorkoutSession[]): WeekTotals {
  return {
    sessions: sessions.length,
    sets: sessions.reduce((sum, session) => sum + completedSetCount(session), 0),
    volume: sessions.reduce((sum, session) => sum + sessionVolume(session), 0),
    minutes: sessions.reduce((sum, session) => sum + (session.durationMinutes ?? 0), 0)
  };
}
