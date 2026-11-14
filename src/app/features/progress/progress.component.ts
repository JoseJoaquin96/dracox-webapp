import { Component, computed, inject, signal } from '@angular/core';
import { WorkoutSession } from '../../domain/models';
import { formatSetResult, lastWeeksVolume, localDayKey, monthCalendar, sessionTimestamp, sessionVolume } from '../../domain/stats';
import { formatNumber, formatPosition, formatShortDate } from '../../shared/format';
import { SessionDetailComponent } from '../../shared/session-detail.component';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { ProgressStore } from '../../state/progress.store';
import { RoutineStore } from '../../state/routine.store';

const monthFormat = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

@Component({
  imports: [SessionDetailComponent],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  readonly exercises = inject(ExerciseStore);
  readonly history = inject(HistoryStore);
  readonly progress = inject(ProgressStore);
  readonly routines = inject(RoutineStore);
  readonly tab = signal<'summary' | 'exercises' | 'history'>('summary');
  readonly search = signal('');
  readonly exerciseRoutine = signal('');
  readonly historyRoutine = signal('');
  readonly historyMonth = signal('');
  readonly page = signal(0);
  readonly previousPage = (page: number) => Math.max(0, page - 1);
  readonly loadingHistory = signal(false);
  readonly historyError = signal(false);
  readonly recentSessions = computed(() => this.history.sessions().slice(0, 3));
  readonly periodVolume = computed(() => this.weeks().reduce((sum, week) => sum + week.volume, 0));
  readonly filteredRecords = computed(() => {
    const routine = this.routines.byId(this.exerciseRoutine());
    const ids = routine ? new Set(routine.days.flatMap(day => day.exercises.map(exercise => exercise.exerciseId))) : null;
    const query = this.search().trim().toLocaleLowerCase('es');
    return this.summary().records.filter(record => (!ids || ids.has(record.exerciseId)) &&
      (this.exercises.byId(record.exerciseId)?.name ?? '').toLocaleLowerCase('es').includes(query));
  });
  readonly selectedRecord = computed(() => this.summary().records.find(record => record.exerciseId === this.progress.selectedExerciseId()));
  filterExercises(query: string, routine: string): void {
    this.search.set(query);
    this.exerciseRoutine.set(routine);
    if (!this.filteredRecords().some(record => record.exerciseId === this.progress.selectedExerciseId())) {
      this.progress.selectedExerciseId.set(null);
    }
  }
  readonly loadingExercise = signal(false);
  readonly exerciseError = signal(false);
  readonly formatSetResult = formatSetResult;
  readonly selectedKind = computed(() => this.exercises.byId(this.progress.selectedExerciseId() ?? '')?.kind ?? 'strength');
  readonly exerciseSessions = computed(() => this.history.sessions()
    .filter(session => !this.exerciseRoutine() || session.routineId === this.exerciseRoutine())
    .map(session => ({ session, sets: session.exercises.filter(exercise => exercise.exerciseId === this.progress.selectedExerciseId()).flatMap(exercise => exercise.sets) }))
    .filter(entry => entry.sets.some(set => set.completed))
    .sort((a, b) => sessionTimestamp(b.session).localeCompare(sessionTimestamp(a.session))));
  readonly lastExerciseSession = computed(() => this.exerciseSessions()[0]);
  readonly evolution = computed(() => this.exerciseSessions().slice(0, 8).map(entry => ({
    date: sessionTimestamp(entry.session),
    best: entry.sets.filter(set => set.completed && set.reps !== null)
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0) || (b.reps ?? 0) - (a.reps ?? 0))[0]
  })));
  readonly reference = computed(() => {
    if (this.loadingExercise() || this.exerciseError() || this.selectedKind() !== 'strength') return null;
    const latest = this.lastExerciseSession();
    const valid = latest?.sets.filter(set => set.completed && set.weight !== null && set.weight > 0 && set.reps !== null && set.reps > 0) ?? [];
    const weight = Math.max(0, ...valid.map(set => set.weight!));
    if (!weight) return null;
    const reps = Math.max(...this.exerciseSessions().flatMap(entry => entry.sets)
      .filter(set => set.completed && set.weight === weight && set.reps !== null).map(set => set.reps!));
    const targets = valid.filter(set => set.weight === weight).map(set => set.target.trim());
    const target = targets.every(value => value === targets[0]) ? targets[0] : '';
    const range = /^(\d+)\s*(?:[-–]\s*(\d+))?$/.exec(target);
    const upper = range ? Number(range[2] ?? range[1]) : null;
    return { weight, reps, target, nextReps: upper !== null && reps + 1 <= upper ? reps + 1 : null };
  });
  async selectExercise(id: string | null): Promise<void> {
    this.progress.selectedExerciseId.set(id);
    if (!id) return;
    this.loadingExercise.set(true);
    this.exerciseError.set(false);
    try {
      while (this.history.hasMore()) {
        if (!(await this.history.loadMore())) { this.exerciseError.set(true); break; }
      }
    } finally { this.loadingExercise.set(false); }
  }
  readonly filteredHistory = computed(() => this.history.sessions().filter(session =>
    (!this.historyRoutine() || session.routineId === this.historyRoutine()) &&
    (!this.historyMonth() || localDayKey(sessionTimestamp(session)).slice(0, 7) === this.historyMonth())));
  readonly historyMonthCount = computed(() => {
    const [year, month] = this.historyMonth().split('-').map(Number);
    const count = this.filteredHistory().length;
    return `${count} ${count === 1 ? 'entrenamiento' : 'entrenamientos'} en ${monthFormat.format(new Date(year, month - 1, 1))}`;
  });
  readonly historyPage = computed(() => this.filteredHistory().slice(this.page() * 10, (this.page() + 1) * 10));
  readonly hasNextPage = computed(() => this.filteredHistory().length > (this.page() + 1) * 10 || this.history.hasMore());

  async filterHistory(month: string, routine: string): Promise<void> {
    this.historyMonth.set(month);
    this.historyRoutine.set(routine);
    this.page.set(0);
    await this.fillHistoryPage();
  }

  async nextPage(): Promise<void> {
    await this.fillHistoryPage(this.page() + 1);
    if (this.filteredHistory().length > (this.page() + 1) * 10) this.page.update(page => page + 1);
  }

  private async fillHistoryPage(target = this.page()): Promise<void> {
    this.loadingHistory.set(true);
    this.historyError.set(false);
    try {
      if (this.historyMonth()) {
        const [year, month] = this.historyMonth().split('-').map(Number);
        if (!(await this.history.loadUntil(new Date(year, month - 1, 1)))) this.historyError.set(true);
      }
      while (this.history.hasMore() && this.filteredHistory().length <= (target + 1) * 10) {
        if (this.historyError()) break;
        if (!(await this.history.loadMore())) { this.historyError.set(true); break; }
      }
    } finally { this.loadingHistory.set(false); }
  }
  private readonly now = new Date();
  readonly formatNumber = formatNumber;
  readonly formatPosition = formatPosition;
  readonly formatShortDate = formatShortDate;
  readonly weekdayInitials = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  /** 0 = this month, -1 = last month… */
  readonly monthOffset = signal(0);
  private readonly viewedMonth = computed(() => new Date(this.now.getFullYear(), this.now.getMonth() + this.monthOffset(), 1));
  readonly monthLabel = computed(() => monthFormat.format(this.viewedMonth()));

  readonly summary = this.progress.summary;
  readonly weeks = computed(() => lastWeeksVolume(this.summary().weeklyVolume, this.now));
  readonly selectedWeekLabel = signal<string | null>(null);
  readonly selectedWeek = computed(() => {
    const weeks = this.weeks();
    return weeks.find((week) => week.label === this.selectedWeekLabel()) ??
      weeks.find((week) => week.isCurrent) ?? weeks[weeks.length - 1] ?? null;
  });
  readonly maxWeekVolume = computed(() => Math.max(...this.weeks().map((week) => week.volume)));
  readonly calendar = computed(() => monthCalendar(this.summary().trainingDays, this.viewedMonth()));
  /** Sessions shown in the detail modal; null when it is closed. */
  readonly detail = signal<WorkoutSession[] | null>(null);

  moveMonth(offset: -1 | 1): void {
    this.monthOffset.update((value) => Math.min(0, value + offset));
  }

  selectWeek(label: string): void {
    this.selectedWeekLabel.set(label);
  }

  async openDay(key: string): Promise<void> {
    const [year, month, day] = key.split('-').map(Number);
    await this.history.loadUntil(new Date(year, month - 1, day));
    this.detail.set(this.history.sessions().filter((session) => localDayKey(sessionTimestamp(session)) === key));
  }

  volume(session: WorkoutSession): number {
    return sessionVolume(session);
  }

  sessionDate(session: WorkoutSession): string {
    return formatShortDate(sessionTimestamp(session));
  }

  percent(value: number, max: number): number {
    return max > 0 ? Math.round(value / max * 100) : 0;
  }
}
