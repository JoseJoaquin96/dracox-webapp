import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Exercise, ExerciseDraft, ExerciseKind } from '../../domain/models';
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
  /** Exercise being edited; null while creating a new one. */
  readonly editing = signal<Exercise | null>(null);
  readonly saving = signal(false);
  draft = emptyDraft();

  openForm(exercise: Exercise | null = null): void {
    this.editing.set(exercise);
    this.draft = exercise
      ? { name: exercise.name, muscle: exercise.muscle, equipment: exercise.equipment, kind: exercise.kind }
      : emptyDraft();
    this.formOpen.set(true);
  }

  async save(): Promise<void> {
    const draft = { ...this.draft, name: this.draft.name.trim(), muscle: this.draft.muscle.trim(), equipment: this.draft.equipment.trim() };
    if (!draft.name || this.saving()) return;
    this.saving.set(true);
    const editing = this.editing();
    const saved = editing ? await this.exercises.update(editing.id, draft) : await this.exercises.create(draft);
    this.saving.set(false);
    if (saved) this.formOpen.set(false);
  }

  remove(exercise: Exercise): void {
    if (window.confirm(`¿Borrar el ejercicio "${exercise.name}"?`)) void this.exercises.remove(exercise.id);
  }
}
