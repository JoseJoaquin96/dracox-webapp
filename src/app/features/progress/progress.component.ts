import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutSession } from '../../domain/models';
import { estimatedOneRepMax, lastWeeksVolume, localDayKey, monthCalendar, sessionTimestamp, sessionVolume } from '../../domain/stats';
import { formatNumber, formatShortDate } from '../../shared/format';
import { SessionDetailComponent } from '../../shared/session-detail.component';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { ProgressStore } from '../../state/progress.store';

const monthFormat = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

@Component({
  imports: [RouterLink, SessionDetailComponent],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  readonly exercises = inject(ExerciseStore);
  readonly history = inject(HistoryStore);
  readonly progress = inject(ProgressStore);
  private readonly now = new Date();
  readonly formatNumber = formatNumber;
  readonly formatShortDate = formatShortDate;
  readonly estimatedOneRepMax = estimatedOneRepMax;
  readonly weekdayInitials = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  /** 0 = this month, -1 = last month… */
  readonly monthOffset = signal(0);
  private readonly viewedMonth = computed(() => new Date(this.now.getFullYear(), this.now.getMonth() + this.monthOffset(), 1));
  readonly monthLabel = computed(() => monthFormat.format(this.viewedMonth()));

  readonly summary = this.progress.summary;
  readonly weeks = computed(() => lastWeeksVolume(this.summary().weeklyVolume, this.now));
  readonly maxWeekVolume = computed(() => Math.max(...this.weeks().map((week) => week.volume)));
  readonly calendar = computed(() => monthCalendar(this.summary().trainingDays, this.viewedMonth()));
  readonly evolution = computed(() => this.progress.exerciseProgress().map((point) => ({
    ...point,
    oneRepMax: estimatedOneRepMax(point.weight, point.reps)
  })));
  readonly maxOneRepMax = computed(() => Math.max(0, ...this.evolution().map((point) => point.oneRepMax)));
  /** Sessions shown in the detail modal; null when it is closed. */
  readonly detail = signal<WorkoutSession[] | null>(null);

  moveMonth(offset: -1 | 1): void {
    this.monthOffset.update((value) => Math.min(0, value + offset));
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
