import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-heading compact-heading"><div><p class="eyebrow">Tu biblioteca</p><h1>Encuentra tu <em>movimiento.</em></h1><p class="heading-subtitle">Una biblioteca clara para que cada ejercicio tenga su propio historial.</p></div><button class="button button-primary" (click)="showForm.set(true)">+ Crear ejercicio</button></div>
    <div class="exercise-toolbar"><label class="search-field"><span>Buscar</span><input [(ngModel)]="query" placeholder="Buscar ejercicio..."></label><div class="exercise-filters">@for (filter of muscleFilters; track filter) { <button class="filter-button" [class.active]="muscleFilter() === filter" (click)="muscleFilter.set(filter)">{{ filter }}</button> }</div></div>
    <section class="exercise-library">@for (exercise of filteredExercises(); track exercise.id) {<article class="exercise-library-card surface-card"><span class="exercise-avatar" [style.background]="exercise.color">{{ exercise.initials }}</span><div class="exercise-copy"><h2>{{ exercise.name }}</h2><p>{{ exercise.muscle }} <span>·</span> {{ exercise.equipment }}</p></div><span class="exercise-kind">{{ exerciseKindLabel(exercise.kind) }}</span></article>}</section>
    @if (showForm()) {<div class="modal-backdrop" (click)="showForm.set(false)"><section class="modal-card" (click)="$event.stopPropagation()"><div class="modal-heading"><div><span class="eyebrow">Biblioteca personal</span><h2>Crea tu movimiento.</h2></div><button class="ghost-icon" (click)="showForm.set(false)">x</button></div><label class="field-label">Nombre<input [(ngModel)]="formName" placeholder="Ej. Press inclinado en máquina"></label><label class="field-label">Grupo muscular<input [(ngModel)]="formMuscle" placeholder="Ej. Pecho"></label><label class="field-label">Equipamiento<input [(ngModel)]="formEquipment" placeholder="Ej. Máquina"></label><div class="modal-actions"><button class="button button-outline" (click)="showForm.set(false)">Cancelar</button><button class="button button-primary" (click)="createExercise()" [disabled]="busy() || !formName.trim()">{{ busy() ? 'Guardando...' : 'Guardar ejercicio' }}</button></div></section></div>}
  `
})
export class ExercisesComponent {
  readonly store = inject(WorkoutStore);
  readonly showForm = signal(false);
  readonly busy = signal(false);
  readonly muscleFilter = signal('Todos');
  readonly muscleFilters = ['Todos', 'Pecho', 'Espalda', 'Piernas'];
  query = '';
  formName = '';
  formMuscle = '';
  formEquipment = '';

  filteredExercises() {
    const query = this.query.toLowerCase().trim();
    const muscle = this.muscleFilter();
    return this.store.exercises().filter((exercise) => (muscle === 'Todos' || exercise.muscle === muscle) && (!query || `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query)));
  }

  exerciseKindLabel(kind: string): string { return kind === 'timed' ? 'Tiempo' : kind === 'bodyweight' ? 'Peso corporal' : kind === 'distance' ? 'Distancia' : 'Fuerza'; }

  async createExercise(): Promise<void> {
    if (!this.formName.trim()) return;
    this.busy.set(true);
    const saved = await this.store.addExercise(this.formName.trim(), this.formMuscle.trim(), this.formEquipment.trim());
    this.busy.set(false);
    if (saved) {
      this.formName = '';
      this.formMuscle = '';
      this.formEquipment = '';
      this.showForm.set(false);
    }
  }
}
