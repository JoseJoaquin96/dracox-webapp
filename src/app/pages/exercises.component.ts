import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseKind } from '../models';
import { WorkoutStore } from '../workout.store';

const KIND_LABELS: Record<ExerciseKind, string> = {
  strength: 'Fuerza',
  bodyweight: 'Peso corporal',
  timed: 'Tiempo',
  distance: 'Distancia'
};

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-heading compact-heading"><div><p class="eyebrow">Tu biblioteca</p><h1>Encuentra tu <em>movimiento.</em></h1><p class="heading-subtitle">Una biblioteca clara para que cada ejercicio tenga su propio historial.</p></div><button class="button button-primary" type="button" (click)="showForm.set(true)">+ Crear ejercicio</button></div>
    <div class="exercise-toolbar"><label class="search-field"><span>Buscar</span><input [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Buscar ejercicio..."></label><div class="exercise-filters">@for (filter of muscleFilters(); track filter) { <button class="filter-button" type="button" [class.active]="muscleFilter() === filter" (click)="muscleFilter.set(filter)">{{ filter }}</button> }</div></div>
    <section class="exercise-library">@for (exercise of filteredExercises(); track exercise.id) {<article class="exercise-library-card surface-card"><span class="exercise-avatar" [style.background]="exercise.color">{{ exercise.initials }}</span><div class="exercise-copy"><h2>{{ exercise.name }}</h2><p>{{ exercise.muscle }} <span>·</span> {{ exercise.equipment }}</p></div><span class="exercise-kind">{{ kindLabels[exercise.kind] }}</span></article>} @empty {<div class="progress-empty"><span>◌</span><strong>No hay ejercicios que coincidan</strong><small>Prueba con otra búsqueda o crea uno nuevo.</small></div>}</section>
    @if (showForm()) {<div class="modal-backdrop" (click)="showForm.set(false)" (keydown.escape)="showForm.set(false)"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="exercise-form-title" (click)="$event.stopPropagation()"><div class="modal-heading"><div><span class="eyebrow">Biblioteca personal</span><h2 id="exercise-form-title">Crea tu movimiento.</h2></div><button class="ghost-icon" type="button" (click)="showForm.set(false)" aria-label="Cerrar">x</button></div><label class="field-label">Nombre<input [(ngModel)]="formName" maxlength="80" placeholder="Ej. Press inclinado en máquina"></label><label class="field-label">Grupo muscular<input [(ngModel)]="formMuscle" maxlength="40" list="muscle-options" placeholder="Ej. Pecho"></label><datalist id="muscle-options">@for (muscle of muscles(); track muscle) {<option [value]="muscle"></option>}</datalist><label class="field-label">Equipamiento<input [(ngModel)]="formEquipment" maxlength="40" placeholder="Ej. Máquina"></label><label class="field-label">Tipo<select [(ngModel)]="formKind">@for (kind of kinds; track kind) {<option [value]="kind">{{ kindLabels[kind] }}</option>}</select></label><div class="modal-actions"><button class="button button-outline" type="button" (click)="showForm.set(false)">Cancelar</button><button class="button button-primary" type="button" (click)="createExercise()" [disabled]="busy() || !formName.trim()">{{ busy() ? 'Guardando...' : 'Guardar ejercicio' }}</button></div></section></div>}
  `
})
export class ExercisesComponent {
  readonly store = inject(WorkoutStore);
  readonly kindLabels = KIND_LABELS;
  readonly kinds = Object.keys(KIND_LABELS) as ExerciseKind[];
  readonly showForm = signal(false);
  readonly busy = signal(false);
  readonly query = signal('');
  readonly muscleFilter = signal('Todos');
  readonly muscles = computed(() => Array.from(new Set(this.store.exercises().map((exercise) => exercise.muscle))).sort((a, b) => a.localeCompare(b, 'es')));
  readonly muscleFilters = computed(() => ['Todos', ...this.muscles()]);
  readonly filteredExercises = computed(() => {
    const query = this.query().toLowerCase().trim();
    const muscle = this.muscleFilter();
    return this.store.exercises().filter((exercise) => (muscle === 'Todos' || exercise.muscle === muscle) && (!query || `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query)));
  });
  formName = '';
  formMuscle = '';
  formEquipment = '';
  formKind: ExerciseKind = 'strength';

  async createExercise(): Promise<void> {
    if (!this.formName.trim()) return;
    this.busy.set(true);
    const saved = await this.store.addExercise(this.formName.trim(), this.formMuscle.trim(), this.formEquipment.trim(), this.formKind);
    this.busy.set(false);
    if (saved) {
      this.formName = '';
      this.formMuscle = '';
      this.formEquipment = '';
      this.formKind = 'strength';
      this.showForm.set(false);
    }
  }
}
