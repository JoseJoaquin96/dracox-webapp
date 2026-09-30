import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseDraft, ExerciseKind } from '../../domain/models';
import { ModalComponent } from '../../shared/modal.component';
import { ExerciseStore } from '../../state/exercise.store';

const ALL_MUSCLES = 'Todos';

const KIND_LABELS: Record<ExerciseKind, string> = {
  strength: 'Fuerza',
  bodyweight: 'Peso corporal',
  timed: 'Tiempo',
  distance: 'Distancia'
};

const emptyDraft = (): ExerciseDraft => ({ name: '', muscle: '', equipment: '', kind: 'strength' });

@Component({
  imports: [FormsModule, ModalComponent],
  templateUrl: './exercises.component.html'
})
export class ExercisesComponent {
  readonly exercises = inject(ExerciseStore);
  readonly kindLabels = KIND_LABELS;
  readonly kinds = Object.keys(KIND_LABELS) as ExerciseKind[];
  readonly query = signal('');
  readonly muscleFilter = signal(ALL_MUSCLES);
  readonly muscleFilters = computed(() => [ALL_MUSCLES, ...this.exercises.muscles()]);
  readonly filtered = computed(() => {
    const query = this.query().toLowerCase().trim();
    const muscle = this.muscleFilter();
    return this.exercises.all().filter((exercise) =>
      (muscle === ALL_MUSCLES || exercise.muscle === muscle) &&
      `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query));
  });
  readonly formOpen = signal(false);
  readonly saving = signal(false);
  draft = emptyDraft();

  async create(): Promise<void> {
    const draft = { ...this.draft, name: this.draft.name.trim(), muscle: this.draft.muscle.trim(), equipment: this.draft.equipment.trim() };
    if (!draft.name || this.saving()) return;
    this.saving.set(true);
    const saved = await this.exercises.create(draft);
    this.saving.set(false);
    if (!saved) return;
    this.draft = emptyDraft();
    this.formOpen.set(false);
  }
}
