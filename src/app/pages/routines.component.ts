import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Routine, RoutineDay, RoutineExercise } from '../models';
import { RoutineDraft, WorkoutStore } from '../workout.store';

type BuilderStep = 'details' | 'exercises';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-heading compact-heading"><div><p class="eyebrow">Tu biblioteca</p><h1>Rutinas que te hacen <em>avanzar.</em></h1><p class="heading-subtitle">Disena tu programa y registra cada entrenamiento en Supabase.</p></div><button class="button button-primary" (click)="openCreate()">+ Nueva rutina</button></div>

    <section class="program-banner surface-card"><div><span class="eyebrow">Programa activo</span><h2>Mis rutinas <span class="active-badge">SUPABASE</span></h2><p>Elige el dia que entrenas cada vez. No hay dias fijos obligatorios.</p></div><button class="ghost-button" (click)="openCreate()">Gestionar programa <span>-></span></button></section>

    <div class="toolbar"><div class="tabs"><button class="tab" [class.active]="!showArchived()" (click)="showArchived.set(false)">Mis rutinas <span>{{ store.activeRoutines().length }}</span></button><button class="tab" [class.active]="showArchived()" (click)="showArchived.set(true)">Archivadas <span>{{ store.archivedRoutines().length }}</span></button></div></div>

    <section class="routine-grid">
      @for (routine of visibleRoutines(); track routine.id) {
        <article class="routine-card surface-card" [style.--accent]="routine.color">
          <div class="routine-card-top"><span class="routine-mark">{{ routine.name.slice(0, 1) }}</span>@if (!routine.archivedAt) { <button class="ghost-icon" (click)="editRoutine(routine)" aria-label="Editar rutina">...</button> }</div>
          <div class="routine-card-copy"><span class="routine-days">{{ routine.days }}</span><h2>{{ routine.name }}</h2><p>{{ routine.focus }}</p></div>
          <div class="routine-stats"><span>· {{ routine.duration }} min</span><span>· {{ totalSets(routine) }} series</span><span>{{ routine.exercises.length }} ejercicios</span></div>
          <div class="routine-card-footer">
            @if (!routine.archivedAt) {
              @for (day of routine.routineDays ?? []; track day.id ?? day.position) {
                @if (day.id) { <a class="button button-small button-primary" [routerLink]="['/workout', routine.id, day.id]">{{ day.name }} -></a> }
              }
              @if (!routine.routineDays?.length) { <a class="button button-small button-primary" [routerLink]="['/workout', routine.id]">Comenzar -></a> }
              <button class="button button-small button-outline" (click)="editRoutine(routine)">Editar</button><button class="delete-link" (click)="removeRoutine(routine)">Archivar</button>
            } @else {
              <button class="button button-small button-primary" (click)="restoreRoutine(routine)">Restaurar</button>
            }
          </div>
        </article>
      } @empty {
        <div class="empty-state surface-card"><span>+</span><h2>{{ showArchived() ? 'No hay rutinas archivadas' : 'Todavia no tienes rutinas' }}</h2><p>{{ showArchived() ? 'Cuando archives una rutina aparecera aqui.' : 'Crea tu primera rutina para empezar.' }}</p></div>
      }
      @if (!showArchived()) { <button class="new-routine-card" (click)="openCreate()"><span>+</span><strong>Crear una nueva rutina</strong><small>Empieza desde cero y hazla tuya</small></button> }
    </section>

    @if (showForm()) {
      <div class="modal-backdrop" (click)="closeForm()">
        <section class="modal-card routine-editor-modal" (click)="$event.stopPropagation()">
          <div class="modal-heading"><div><span class="eyebrow">{{ editing() ? 'Editar rutina' : 'Nueva rutina' }}</span><h2>{{ builderStep() === 'details' ? 'Empieza por lo esencial.' : 'Construye tu programa.' }}</h2></div><button class="ghost-icon" (click)="closeForm()">x</button></div>
          <div class="builder-steps"><span [class.active]="builderStep() === 'details'" [class.done]="builderStep() === 'exercises'">1 <b>Datos</b></span><i></i><span [class.active]="builderStep() === 'exercises'">2 <b>Ejercicios</b></span></div>

          <div class="editor-fields"><label class="field-label">Nombre<input [(ngModel)]="formName" placeholder="Ej. Hipertrofia 4 dias"></label><label class="field-label">Enfoque<input [(ngModel)]="formFocus" placeholder="Ej. Pecho - Espalda - Pierna"></label><label class="field-label">Primer dia<input [(ngModel)]="formDays" placeholder="Ej. Upper A"></label></div>

          @if (builderStep() === 'details') {
            <div class="builder-explanation"><span>*</span><div><strong>Primero crea la estructura</strong><p>Despues podras anadir varios dias y sus ejercicios. Los pesos se registran al entrenar.</p></div></div>
            <div class="modal-actions"><button class="button button-outline" (click)="closeForm()">Cancelar</button><button class="button button-primary" (click)="continueFromDetails()" [disabled]="!formName.trim()">Continuar -></button></div>
          } @else {
            <div class="builder-intro"><div><span class="eyebrow">Paso 2 de 2</span><strong>Anade los ejercicios del dia</strong></div><p>La rutina puede tener tantos dias como necesites. Luego eliges cual haces.</p></div>
            <div class="routine-day-editor"><label class="field-label">Dia<select [ngModel]="selectedDayIndex()" (ngModelChange)="selectDay(toIndex($event))">@for (day of formRoutineDays(); track $index) { <option [value]="$index">{{ day.name }}</option> }</select></label><button type="button" class="button button-small button-outline" (click)="addRoutineDay()">+ Dia</button><button type="button" class="button button-small button-outline" (click)="removeRoutineDay()" [disabled]="formRoutineDays().length <= 1">Quitar dia</button></div>
            <div class="editor-section-heading"><div><span class="eyebrow">Estructura de la sesion</span><strong>{{ formExercises().length ? 'Ejercicios del dia' : 'Aun no hay ejercicios' }}</strong></div><span>{{ formExercises().length }} bloques</span></div>
            <div class="editor-exercise-list">
              @for (planned of formExercises(); track $index; let index = $index) {
                <div class="editor-exercise-row"><span class="drag-handle">::</span><span class="editor-exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div class="editor-exercise-name"><strong>{{ exerciseName(planned.exerciseId) }}</strong><small>{{ exerciseMeta(planned.exerciseId) }}</small></div><label class="mini-field"><span>Series</span><input type="number" min="1" max="20" [ngModel]="planned.sets" (ngModelChange)="updateExercise(index, { sets: toNumber($event, planned.sets) })"></label><label class="mini-field"><span>Reps</span><input [ngModel]="planned.repRange" (ngModelChange)="updateExercise(index, { repRange: $event })"></label><label class="mini-field rest-field"><span>Descanso</span><input type="number" min="0" step="15" [ngModel]="planned.restSeconds" (ngModelChange)="updateExercise(index, { restSeconds: toNumber($event, planned.restSeconds) })"><small>s</small></label><div class="editor-row-actions"><button class="row-icon" (click)="moveExercise(index, -1)" [disabled]="index === 0" aria-label="Subir ejercicio">^</button><button class="row-icon" (click)="moveExercise(index, 1)" [disabled]="index === formExercises().length - 1" aria-label="Bajar ejercicio">v</button><button class="row-icon danger" (click)="removeExercise(index)" aria-label="Eliminar ejercicio">x</button></div></div>
              } @empty { <div class="editor-empty"><span>+</span><strong>Tu rutina todavia esta vacia</strong><small>Selecciona un ejercicio debajo para anadirlo.</small></div> }
            </div>
            <div class="add-exercise-row"><select [(ngModel)]="selectedExerciseId"><option value="">Selecciona un ejercicio...</option>@for (exercise of store.exercises(); track exercise.id) {<option [value]="exercise.id">{{ exercise.name }}</option>}</select><button class="button button-small button-primary" (click)="addSelectedExercise()" [disabled]="!selectedExerciseId">+ Anadir ejercicio</button></div>
            <div class="modal-note"><span>*</span><p>El peso y las repeticiones reales se guardan al comenzar una sesion.</p></div>
            <div class="modal-actions"><button class="button button-outline" (click)="builderStep.set('details')"><- Revisar datos</button><button class="button button-primary" (click)="saveRoutine()">Guardar rutina</button></div>
          }
        </section>
      </div>
    }
  `
})
export class RoutinesComponent {
  readonly store = inject(WorkoutStore);
  readonly showForm = signal(false);
  readonly editing = signal<Routine | null>(null);
  readonly builderStep = signal<BuilderStep>('details');
  readonly formExercises = signal<RoutineExercise[]>([]);
  readonly formRoutineDays = signal<RoutineDay[]>([]);
  readonly selectedDayIndex = signal(0);
  readonly showArchived = signal(false);
  readonly visibleRoutines = computed(() => this.showArchived() ? this.store.archivedRoutines() : this.store.activeRoutines());

  formName = '';
  formFocus = '';
  formDays = '';
  selectedExerciseId = '';

  totalSets(routine: Routine): number { return routine.exercises.reduce((sum, exercise) => sum + exercise.sets, 0); }
  exerciseName(id: string): string { return this.store.exerciseById(id)?.name ?? 'Ejercicio eliminado'; }
  exerciseMeta(id: string): string { const exercise = this.store.exerciseById(id); return exercise ? `${exercise.muscle} - ${exercise.equipment}` : 'Sin datos'; }
  toNumber(value: number | string | null, fallback: number): number { const parsed = Number(value); return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback; }
  toIndex(value: number | string): number { const parsed = Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0; }

  openCreate(): void {
    this.editing.set(null);
    this.builderStep.set('details');
    this.formName = '';
    this.formFocus = '';
    this.formDays = 'Dia 1';
    this.formExercises.set([]);
    this.formRoutineDays.set([{ name: 'Dia 1', position: 0, exercises: [] }]);
    this.selectedDayIndex.set(0);
    this.selectedExerciseId = '';
    this.showForm.set(true);
  }

  editRoutine(routine: Routine): void {
    const days = routine.routineDays?.length
      ? routine.routineDays.map((day) => ({ ...day, exercises: day.exercises.map((exercise) => ({ ...exercise })) }))
      : [{ name: routine.days, position: 0, exercises: routine.exercises.map((exercise) => ({ ...exercise })) }];
    this.editing.set(routine);
    this.builderStep.set('exercises');
    this.formName = routine.name;
    this.formFocus = routine.focus;
    this.formRoutineDays.set(days);
    this.selectedDayIndex.set(0);
    this.selectedExerciseId = '';
    this.loadSelectedDay(0);
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  continueFromDetails(): void {
    if (!this.formName.trim()) return;
    if (!this.formRoutineDays().length) this.formRoutineDays.set([{ name: 'Dia 1', position: 0, exercises: [] }]);
    this.commitSelectedDay();
    this.builderStep.set('exercises');
  }

  async saveRoutine(): Promise<void> {
    this.commitSelectedDay();
    const editing = this.editing();
    const input: RoutineDraft = {
      name: this.formName.trim() || 'Nueva rutina',
      focus: this.formFocus.trim() || 'Nueva rutina',
      duration: editing?.duration ?? 45,
      color: editing?.color ?? '#d8f36a',
      routineDays: this.formRoutineDays().map((day, position) => ({
        ...day,
        position,
        exercises: day.exercises.map((exercise) => ({ ...exercise }))
      }))
    };
    const saved = editing
      ? await this.store.updateRoutineProgram(editing.id, input)
      : await this.store.createRoutineProgram(input);
    if (saved) this.closeForm();
  }

  selectDay(index: number): void { this.commitSelectedDay(); this.loadSelectedDay(index); }

  addRoutineDay(): void {
    this.commitSelectedDay();
    const position = this.formRoutineDays().length;
    this.formRoutineDays.update((days) => [...days, { name: `Dia ${position + 1}`, position, exercises: [] }]);
    this.loadSelectedDay(position);
  }

  removeRoutineDay(): void {
    if (this.formRoutineDays().length <= 1) return;
    this.commitSelectedDay();
    const removed = this.selectedDayIndex();
    const days = this.formRoutineDays().filter((_, index) => index !== removed).map((day, position) => ({ ...day, position }));
    this.formRoutineDays.set(days);
    this.loadSelectedDay(Math.min(removed, days.length - 1));
  }

  addSelectedExercise(): void {
    if (!this.selectedExerciseId) return;
    this.formExercises.update((exercises) => [...exercises, { exerciseId: this.selectedExerciseId, sets: 3, repRange: '8-10', restSeconds: 90 }]);
    this.selectedExerciseId = '';
  }

  updateExercise(index: number, changes: Partial<RoutineExercise>): void { this.formExercises.update((exercises) => exercises.map((exercise, itemIndex) => itemIndex === index ? { ...exercise, ...changes } : exercise)); }
  removeExercise(index: number): void { this.formExercises.update((exercises) => exercises.filter((_, itemIndex) => itemIndex !== index)); }

  moveExercise(index: number, direction: -1 | 1): void {
    this.formExercises.update((exercises) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= exercises.length) return exercises;
      const copy = [...exercises];
      [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
      return copy;
    });
  }

  removeRoutine(routine: Routine): void {
    if (window.confirm(`Archivar la rutina "${routine.name}"? Podras restaurarla despues.`)) void this.store.archiveRoutine(routine.id);
  }

  restoreRoutine(routine: Routine): void { void this.store.unarchiveRoutine(routine.id); }

  private commitSelectedDay(): void {
    const index = this.selectedDayIndex();
    this.formRoutineDays.update((days) => days.map((day, dayIndex) => dayIndex === index ? {
      ...day,
      name: this.formDays.trim() || `Dia ${index + 1}`,
      position: index,
      exercises: this.formExercises().map((exercise) => ({ ...exercise }))
    } : day));
  }

  private loadSelectedDay(index: number): void {
    const day = this.formRoutineDays()[index];
    if (!day) return;
    this.selectedDayIndex.set(index);
    this.formDays = day.name;
    this.formExercises.set(day.exercises.map((exercise) => ({ ...exercise })));
  }
}
