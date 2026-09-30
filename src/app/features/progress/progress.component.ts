import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutSession } from '../../domain/models';
import { completedSetCount, monthCalendar, personalRecords, sessionTimestamp, sessionVolume } from '../../domain/stats';
import { formatNumber, formatShortDate } from '../../shared/format';
import { ExerciseStore } from '../../state/exercise.store';
import { HistoryStore } from '../../state/history.store';

@Component({
  imports: [RouterLink],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  readonly exercises = inject(ExerciseStore);
  private readonly history = inject(HistoryStore);
  private readonly now = new Date();
  readonly formatNumber = formatNumber;
  readonly formatShortDate = formatShortDate;
  readonly weekdayInitials = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  readonly currentMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.now);

  readonly sessions = this.history.sessions;
  readonly totalVolume = computed(() => this.sessions().reduce((sum, session) => sum + sessionVolume(session), 0));
  readonly completedSets = computed(() => this.sessions().reduce((sum, session) => sum + completedSetCount(session), 0));
  readonly calendar = computed(() => monthCalendar(this.sessions(), this.now));
  readonly records = computed(() => personalRecords(this.sessions()));

  volume(session: WorkoutSession): number {
    return sessionVolume(session);
  }

  sessionDate(session: WorkoutSession): string {
    return formatShortDate(sessionTimestamp(session));
  }
}
