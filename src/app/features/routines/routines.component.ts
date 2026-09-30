import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Routine } from '../../domain/models';
import { plannedSets, routineExercises } from '../../domain/stats';
import { RoutineStore } from '../../state/routine.store';
import { RoutineEditorComponent } from './routine-editor.component';

@Component({
  imports: [RouterLink, RoutineEditorComponent],
  templateUrl: './routines.component.html'
})
export class RoutinesComponent {
  readonly routines = inject(RoutineStore);
  readonly plannedSets = plannedSets;
  readonly routineExercises = routineExercises;
  readonly showArchived = signal(false);
  readonly visibleRoutines = computed(() => this.showArchived() ? this.routines.archived() : this.routines.active());
  readonly editorOpen = signal(false);
  /** Routine being edited; null while creating a new one. */
  readonly editing = signal<Routine | null>(null);

  openEditor(routine: Routine | null = null): void {
    this.editing.set(routine);
    this.editorOpen.set(true);
  }

  archive(routine: Routine): void {
    if (window.confirm(`¿Archivar la rutina "${routine.name}"? Podrás restaurarla después.`)) {
      void this.routines.setArchived(routine.id, true);
    }
  }

  restore(routine: Routine): void {
    void this.routines.setArchived(routine.id, false);
  }
}
