import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutSession } from '../../domain/models';
import { estimatedOneRepMax, lastWeeksVolume, monthCalendar, sessionTimestamp, sessionVolume } from '../../domain/stats';
import { formatNumber, formatShortDate } from '../../shared/format';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';
import { ProgressStore } from '../../state/progress.store';

@Component({
  imports: [RouterLink],
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
  readonly currentMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.now);

  readonly summary = this.progress.summary;
  readonly weeks = computed(() => lastWeeksVolume(this.summary().weeklyVolume, this.now));
  readonly maxWeekVolume = computed(() => Math.max(...this.weeks().map((week) => week.volume)));
  readonly calendar = computed(() => monthCalendar(this.summary().trainingDays, this.now));
  readonly evolution = computed(() => this.progress.exerciseProgress().map((point) => ({
    ...point,
    oneRepMax: estimatedOneRepMax(point.weight, point.reps)
  })));
  readonly maxOneRepMax = computed(() => Math.max(0, ...this.evolution().map((point) => point.oneRepMax)));

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
