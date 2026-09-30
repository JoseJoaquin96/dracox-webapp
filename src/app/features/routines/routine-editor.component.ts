import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routine, RoutineDay, RoutineDraft, RoutineExercise } from '../../domain/models';
import { formatPosition } from '../../shared/format';
import { ModalComponent } from '../../shared/modal.component';
import { ExerciseStore } from '../../state/exercise.store';
import { RoutineStore } from '../../state/routine.store';

const NEW_EXERCISE: Omit<RoutineExercise, 'exerciseId'> = { sets: 3, repRange: '8-10', restSeconds: 90 };

@Component({
  selector: 'dracox-routine-editor',
  imports: [FormsModule, ModalComponent],
  templateUrl: './routine-editor.component.html'
})
export class RoutineEditorComponent {
  /** Routine to edit, or null to create a new one. */
  readonly routine = input<Routine | null>(null);
  readonly closed = output<void>();
  readonly exercises = inject(ExerciseStore);
  private readonly routines = inject(RoutineStore);
  readonly formatPosition = formatPosition;

  readonly draft = linkedSignal<RoutineDraft>(() => toDraft(this.routine()));
  readonly step = linkedSignal<'details' | 'exercises'>(() => this.routine() ? 'exercises' : 'details');
  readonly dayIndex = signal(0);
  readonly day = computed(() => this.draft().days[this.dayIndex()]);
  readonly saving = signal(false);
  selectedExerciseId = '';

  patch(changes: Partial<RoutineDraft>): void {
    this.draft.update((draft) => ({ ...draft, ...changes }));
  }

  selectDay(index: number | string): void {
    this.dayIndex.set(Number(index));
  }

  renameDay(name: string): void {
    this.updateDay((day) => ({ ...day, name }));
  }

  addDay(): void {
    const days = this.draft().days;
    this.patch({ days: [...days, { name: `Día ${days.length + 1}`, exercises: [] }] });
    this.dayIndex.set(days.length);
  }

  removeDay(): void {
    const index = this.dayIndex();
    this.patch({ days: this.draft().days.filter((_, dayIndex) => dayIndex !== index) });
    this.dayIndex.set(Math.max(0, index - 1));
  }

  addExercise(): void {
    const exerciseId = this.selectedExerciseId;
    if (!exerciseId) return;
    this.updateExercises((exercises) => [...exercises, { exerciseId, ...NEW_EXERCISE }]);
    this.selectedExerciseId = '';
  }

  updateExercise(index: number, changes: Partial<RoutineExercise>): void {
    this.updateExercises((exercises) => exercises.map((exercise, itemIndex) => itemIndex === index ? { ...exercise, ...changes } : exercise));
  }

  removeExercise(index: number): void {
    this.updateExercises((exercises) => exercises.filter((_, itemIndex) => itemIndex !== index));
  }

  moveExercise(index: number, offset: -1 | 1): void {
    this.updateExercises((exercises) => {
      const copy = [...exercises];
      [copy[index], copy[index + offset]] = [copy[index + offset], copy[index]];
      return copy;
    });
  }

  /** Parses a numeric input, keeping the previous value when the input is not valid. */
  toCount(value: unknown, previous: number, min = 1): number {
    const parsed = Math.round(Number(value));
    return Number.isFinite(parsed) && parsed >= min ? parsed : previous;
  }

  async save(): Promise<void> {
    const draft = this.draft();
    if (this.saving() || !draft.name.trim()) return;
    const cleanDraft: RoutineDraft = {
      ...draft,
      name: draft.name.trim(),
      focus: draft.focus.trim(),
      days: draft.days.map((day, index) => ({ ...day, name: day.name.trim() || `Día ${index + 1}` }))
    };
    this.saving.set(true);
    const routine = this.routine();
    const saved = routine ? await this.routines.update(routine.id, cleanDraft) : await this.routines.create(cleanDraft);
    this.saving.set(false);
    if (saved) this.closed.emit();
  }

  private updateDay(change: (day: RoutineDay) => RoutineDay): void {
    const index = this.dayIndex();
    this.patch({ days: this.draft().days.map((day, dayIndex) => dayIndex === index ? change(day) : day) });
  }

  private updateExercises(change: (exercises: RoutineExercise[]) => RoutineExercise[]): void {
    this.updateDay((day) => ({ ...day, exercises: change(day.exercises) }));
  }
}

function toDraft(routine: Routine | null): RoutineDraft {
  if (!routine) return { name: '', focus: '', duration: 45, color: '#d8f36a', days: [{ name: 'Día 1', exercises: [] }] };
  return {
    name: routine.name,
    focus: routine.focus,
    duration: routine.duration,
    color: routine.color,
    days: routine.days.map((day) => ({ ...day, exercises: [...day.exercises] }))
  };
}
