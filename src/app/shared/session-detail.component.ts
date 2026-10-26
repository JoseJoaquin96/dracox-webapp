import { Component, computed, inject, input, output } from '@angular/core';
import { WorkoutSession } from '../domain/models';
import { completedSetCount, formatSetResult, sessionTimestamp, sessionVolume } from '../domain/stats';
import { ExerciseStore } from '../state/exercise.store';
import { formatNumber } from './format';
import { ModalComponent } from './modal.component';

const longDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

/** Read-only summary of the workouts done on one day: exercises, weights and reps. */
@Component({
  selector: 'dracox-session-detail',
  imports: [ModalComponent],
  template: `
    <dracox-modal panelClass="session-detail-modal" [eyebrow]="dateLabel()" [heading]="heading()" (closed)="closed.emit()">
      @for (session of sessions(); track session.id) {
        <section class="session-detail">
          @if (sessions().length > 1) { <h3>{{ session.name }}</h3> }
          <div class="session-detail-stats">
            <span><strong>{{ session.durationMinutes ?? 0 }}</strong> min</span>
            <span><strong>{{ setCount(session) }}</strong> series</span>
            <span><strong>{{ formatNumber(volume(session)) }}</strong> kg</span>
          </div>
          @for (item of session.exercises; track item.id; let index = $index) {
            @let exercise = exercises.byId(item.exerciseId);
            <div class="session-detail-exercise">
              <span class="exercise-number">{{ index + 1 }}</span>
              <div>
                <strong>{{ exercise?.name ?? 'Ejercicio' }}</strong>
                <div class="set-chips">
                  @for (set of item.sets; track set.id) {
                    @if (set.completed) { <span>{{ formatSetResult(set, exercise?.kind) }}</span> }
                  }
                  @if (!hasCompleted(item.sets)) { <small>Sin series completadas</small> }
                </div>
              </div>
            </div>
          }
        </section>
      } @empty {
        <p class="metric-foot">No hay detalles cargados para este día.</p>
      }
    </dracox-modal>
  `
})
export class SessionDetailComponent {
  readonly sessions = input.required<WorkoutSession[]>();
  readonly closed = output<void>();
  readonly exercises = inject(ExerciseStore);
  readonly formatNumber = formatNumber;
  readonly formatSetResult = formatSetResult;
  readonly volume = sessionVolume;
  readonly setCount = completedSetCount;

  readonly dateLabel = computed(() => {
    const first = this.sessions()[0];
    return first ? longDate.format(new Date(sessionTimestamp(first))) : '';
  });
  readonly heading = computed(() => {
    const sessions = this.sessions();
    if (sessions.length > 1) return `${sessions.length} entrenamientos`;
    const session = sessions[0];
    if (!session) return 'Entrenamiento';
    return session.dayName && session.dayName !== session.name ? `${session.name} · ${session.dayName}` : session.name;
  });

  hasCompleted(sets: { completed: boolean }[]): boolean {
    return sets.some((set) => set.completed);
  }
}
