import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Routine, RoutineExercise } from '../models';
import { WorkoutStore } from '../workout.store';

type BuilderStep = 'details' | 'exercises';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-heading compact-heading"><div><p class="eyebrow">Tu biblioteca</p><h1>Rutinas que te hacen <em>avanzar.</em></h1><p class="heading-subtitle">Diseña tu semana una vez. En el gym, solo tienes que ejecutar.</p></div><button class="button button-primary" (click)="openCreate()">＋ Nueva rutina</button></div>

    <section class="program-banner surface-card"><div><span class="eyebrow">Programa activo</span><h2>Base de hipertrofia <span class="active-badge">ACTIVO</span></h2><p>3 sesiones por semana · Próxima revisión en 12 días</p></div><div class="program-progress"><div class="program-progress-top"><span>Semana 3 de 8</span><strong>38%</strong></div><span class="progress-track"><i style="width:38%"></i></span></div><button class="ghost-button">Gestionar programa <span>→</span></button></section>

    <div class="toolbar"><div class="tabs"><button class="tab active">Mis rutinas <span>{{ store.routines().length }}</span></button><button class="tab">Plantillas <span>0</span></button></div><div class="toolbar-actions"><button class="filter-button">⌕ Buscar</button><button class="filter-button">Ordenar: recientes <span>⌄</span></button></div></div>

    <section class="routine-grid">
      @for (routine of store.routines(); track routine.id) {
        <article class="routine-card surface-card" [style.--accent]="routine.color">
          <div class="routine-card-top"><span class="routine-mark">{{ routine.name.slice(0, 1) }}</span><button class="ghost-icon" (click)="editRoutine(routine)" aria-label="Editar rutina">•••</button></div>
          <div class="routine-card-copy"><span class="routine-days">{{ routine.days }}</span><h2>{{ routine.name }}</h2><p>{{ routine.focus }}</p></div>
          <div class="routine-stats"><span>◷ {{ routine.duration }} min</span><span>▤ {{ totalSets(routine) }} series</span><span>{{ routine.exercises.length }} ejercicios</span></div>
          <div class="routine-card-footer"><a class="button button-small button-primary" [routerLink]="['/workout', routine.id]">Comenzar <span>↗</span></a><button class="button button-small button-outline" (click)="editRoutine(routine)">Editar</button><button class="delete-link" (click)="removeRoutine(routine)">Eliminar</button></div>
        </article>
      }
      <button class="new-routine-card" (click)="openCreate()"><span>＋</span><strong>Crear una nueva rutina</strong><small>Empieza desde cero y hazla tuya</small></button>
    </section>

    @if (showForm()) {
      <div class="modal-backdrop" (click)="closeForm()">
        <section class="modal-card routine-editor-modal" (click)="$event.stopPropagation()">
          <div class="modal-heading"><div><span class="eyebrow">{{ editing() ? 'Editar rutina' : 'Nueva rutina' }}</span><h2>{{ builderStep() === 'details' ? 'Empieza por lo esencial.' : 'Construye tu sesión.' }}</h2></div><button class="ghost-icon" (click)="closeForm()">×</button></div>
          <div class="builder-steps"><span [class.active]="builderStep() === 'details'" [class.done]="builderStep() === 'exercises'">1 <b>Datos</b></span><i></i><span [class.active]="builderStep() === 'exercises'">2 <b>Ejercicios</b></span></div>

          <div class="editor-fields"><label class="field-label">Nombre<input [(ngModel)]="formName" placeholder="Ej. Push A"></label><label class="field-label">Enfoque<input [(ngModel)]="formFocus" placeholder="Ej. Pecho · Hombros · Tríceps"></label><label class="field-label">Día<input [(ngModel)]="formDays" placeholder="Ej. Lunes"></label></div>

          @if (builderStep() === 'details') {
            <div class="builder-explanation"><span>✦</span><div><strong>Primero crea la estructura</strong><p>Después añadirás los ejercicios con sus series y repeticiones. Los pesos se registran cuando empieces a entrenar.</p></div></div>
            <div class="modal-actions"><button class="button button-outline" (click)="closeForm()">Cancelar</button><button class="button button-primary" (click)="continueFromDetails()" [disabled]="!formName.trim()">{{ editing() ? 'Continuar a ejercicios' : 'Crear rutina y añadir ejercicios' }} <span>→</span></button></div>
          } @else {
            <div class="builder-intro"><div><span class="eyebrow">Paso 2 de 2</span><strong>Añade los ejercicios de esta rutina</strong></div><p>Aquí solo defines qué vas a hacer. El peso real se anota al comenzar cada entrenamiento.</p></div>
            <div class="editor-section-heading"><div><span class="eyebrow">Estructura de la sesión</span><strong>{{ formExercises().length ? 'Ejercicios de la rutina' : 'Aún no hay ejercicios' }}</strong></div><span>{{ formExercises().length }} bloques</span></div>
            <div class="editor-exercise-list">
              @for (planned of formExercises(); track $index; let index = $index) {
                <div class="editor-exercise-row"><span class="drag-handle">⠿</span><span class="editor-exercise-number">{{ (index + 1).toString().padStart(2, '0') }}</span><div class="editor-exercise-name"><strong>{{ exerciseName(planned.exerciseId) }}</strong><small>{{ exerciseMeta(planned.exerciseId) }}</small></div><label class="mini-field"><span>Series</span><input type="number" min="1" max="20" [ngModel]="planned.sets" (ngModelChange)="updateExercise(index, { sets: toNumber($event, planned.sets) })"></label><label class="mini-field"><span>Reps</span><input [ngModel]="planned.repRange" (ngModelChange)="updateExercise(index, { repRange: $event })"></label><label class="mini-field rest-field"><span>Descanso</span><input type="number" min="0" step="15" [ngModel]="planned.restSeconds" (ngModelChange)="updateExercise(index, { restSeconds: toNumber($event, planned.restSeconds) })"><small>s</small></label><div class="editor-row-actions"><button class="row-icon" (click)="moveExercise(index, -1)" [disabled]="index === 0" aria-label="Subir ejercicio">↑</button><button class="row-icon" (click)="moveExercise(index, 1)" [disabled]="index === formExercises().length - 1" aria-label="Bajar ejercicio">↓</button><button class="row-icon danger" (click)="removeExercise(index)" aria-label="Eliminar ejercicio">×</button></div></div>
              } @empty { <div class="editor-empty"><span>＋</span><strong>Tu rutina todavía está vacía</strong><small>Selecciona un ejercicio debajo para añadirlo.</small></div> }
            </div>
            <div class="add-exercise-row"><select [(ngModel)]="selectedExerciseId"><option value="">Selecciona un ejercicio...</option>@for (exercise of store.exercises(); track exercise.id) {<option [value]="exercise.id">{{ exercise.name }}</option>}</select><button class="button button-small button-primary" (click)="addSelectedExercise()" [disabled]="!selectedExerciseId">＋ Añadir ejercicio</button></div>
            <div class="modal-note"><span>✳</span><p>Esta pantalla no utiliza pesos. Cuando pulses “Comenzar”, Forge preparará cada serie y podrás registrar el peso y las repeticiones reales.</p></div>
            <div class="modal-actions"><button class="button button-outline" (click)="builderStep.set('details')">← Revisar datos</button><button class="button button-primary" (click)="saveRoutine()">Guardar rutina <span>✓</span></button></div>
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
  readonly routineCount = computed(() => this.store.routines().length);
  formName = '';
  formFocus = '';
  formDays = '';
  selectedExerciseId = '';

  totalSets(routine: Routine): number { return routine.exercises.reduce((sum, exercise) => sum + exercise.sets, 0); }
  exerciseName(id: string): string { return this.store.exerciseById(id)?.name ?? 'Ejercicio eliminado'; }
  exerciseMeta(id: string): string { const exercise = this.store.exerciseById(id); return exercise ? `${exercise.muscle} · ${exercise.equipment}` : 'Sin datos'; }
  toNumber(value: number | string | null, fallback: number): number { const parsed = Number(value); return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback; }

  openCreate(): void {
    this.editing.set(null); this.builderStep.set('details'); this.formName = ''; this.formFocus = ''; this.formDays = ''; this.formExercises.set([]); this.selectedExerciseId = ''; this.showForm.set(true);
  }

  editRoutine(routine: Routine): void {
    this.editing.set(routine); this.builderStep.set('exercises'); this.formName = routine.name; this.formFocus = routine.focus; this.formDays = routine.days; this.formExercises.set(routine.exercises.map((exercise) => ({ ...exercise }))); this.selectedExerciseId = ''; this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  continueFromDetails(): void {
    const name = this.formName.trim();
    if (!name) return;
    const focus = this.formFocus.trim() || 'Nueva rutina';
    const days = this.formDays.trim() || 'Sin programar';
    const editing = this.editing();
    if (editing) {
      this.store.updateRoutine(editing.id, { name, focus, days });
    } else {
      const created = this.store.addRoutine(name, focus);
      this.store.updateRoutine(created.id, { name, focus, days, exercises: [] });
      this.editing.set(this.store.routineById(created.id) ?? created);
    }
    this.builderStep.set('exercises');
  }

  saveRoutine(): void {
    const editing = this.editing();
    if (!editing) return;
    this.store.updateRoutine(editing.id, { name: this.formName.trim() || 'Nueva rutina', focus: this.formFocus.trim() || 'Nueva rutina', days: this.formDays.trim() || 'Sin programar', exercises: this.formExercises().map((exercise) => ({ ...exercise })) });
    this.closeForm();
  }

  addSelectedExercise(): void {
    if (!this.selectedExerciseId) return;
    this.formExercises.update((exercises) => [...exercises, { exerciseId: this.selectedExerciseId, sets: 3, repRange: '8–10', restSeconds: 90 }]);
    this.selectedExerciseId = '';
  }

  updateExercise(index: number, changes: Partial<RoutineExercise>): void { this.formExercises.update((exercises) => exercises.map((exercise, itemIndex) => itemIndex === index ? { ...exercise, ...changes } : exercise)); }
  removeExercise(index: number): void { this.formExercises.update((exercises) => exercises.filter((_, itemIndex) => itemIndex !== index)); }

  moveExercise(index: number, direction: -1 | 1): void {
    this.formExercises.update((exercises) => { const targetIndex = index + direction; if (targetIndex < 0 || targetIndex >= exercises.length) return exercises; const copy = [...exercises]; [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]]; return copy; });
  }

  removeRoutine(routine: Routine): void { if (window.confirm(`¿Eliminar la rutina «${routine.name}»?`)) this.store.deleteRoutine(routine.id); }
}
