import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutSession } from '../models';
import { WorkoutStore } from '../workout.store';

interface PersonalRecordView { exerciseId: string; name: string; weight: number; reps: number; date: string; }

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-heading compact-heading"><div><p class="eyebrow">Datos que cuentan</p><h1>Tu progreso, <em>en perspectiva.</em></h1><p class="heading-subtitle">No busques días perfectos. Busca tendencias que se mueven en la dirección correcta.</p></div><button class="filter-button strong-filter">Todo el historial <span>⌄</span></button></div>
    <section class="progress-highlight"><article class="highlight-main surface-card"><div><span class="eyebrow">Volumen registrado</span><strong>{{ formatNumber(totalVolume()) }} <small>kg</small></strong><span class="trend positive">{{ completedSessions().length }} sesiones finalizadas</span></div><div class="line-chart"><i class="chart-line"></i><span class="chart-point p1"></span><span class="chart-point p2"></span><span class="chart-point p3"></span><span class="chart-point p4"></span><span class="chart-point p5"></span><div class="chart-labels"><span>Inicio</span><span>Constancia</span><span>Ahora</span></div></div></article><article class="highlight-side surface-card"><span class="eyebrow">Series completadas</span><strong>{{ completedSets() }} <small>series</small></strong><p>Tu historial crece cada vez que registras y finalizas una sesión.</p><a class="text-link" href="#records">Ver récords →</a></article></section>
    <section class="content-grid two-column-grid progress-grid"><article class="surface-card chart-card"><div class="section-heading"><div><span class="eyebrow">Fuerza</span><h3>Mejores marcas registradas</h3></div><a class="text-link" routerLink="/exercises">Por ejercicio →</a></div>@for (record of records(); track record.exerciseId) {<div class="lift-row"><div class="lift-info"><span class="exercise-mini-avatar orange">↗</span><span><strong>{{ record.name }}</strong><small>{{ record.reps }} repeticiones · {{ sessionDate(record.date) }}</small></span></div><strong>{{ formatNumber(record.weight) }} <small>kg</small></strong><span class="trend positive">PR</span></div>} @empty {<div class="progress-empty"><span>↗</span><strong>Aún no hay marcas</strong><small>Completa algunas series y aparecerán aquí.</small></div>}<a class="full-width-link" routerLink="/routines">Registrar un nuevo entrenamiento <span>→</span></a></article><article class="surface-card chart-card"><div class="section-heading"><div><span class="eyebrow">Constancia</span><h3>Calendario de sesiones</h3></div><span class="calendar-month">{{ currentMonth }}</span></div><div class="calendar"><div class="calendar-head"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="calendar-days">@for (day of calendarDays(); track $index) {<span [class.done]="day.done" [class.muted]="day.muted">{{ day.label }}</span>}</div></div><div class="calendar-legend"><span><i class="legend-dot done"></i>Entrenamiento</span><span><i class="legend-dot"></i>Descanso</span></div></article></section>
    <section class="surface-card records-card" id="records"><div class="section-heading"><div><span class="eyebrow">Historial local</span><h3>Entrenamientos finalizados</h3></div><span class="calendar-month">{{ completedSessions().length }} sesiones</span></div>@for (session of completedSessions(); track session.id) {<div class="record-item session-history-row"><span class="record-icon">✓</span><div><strong>{{ session.name }}</strong><small>{{ sessionDate(session.finishedAt ?? session.startedAt) }} · {{ session.durationMinutes ?? 0 }} min · {{ formatNumber(sessionVolume(session)) }} kg de volumen</small></div><b>{{ session.exercises.length }} ejercicios</b></div>} @empty {<div class="progress-empty history-empty"><span>◌</span><strong>Tu historial aparecerá aquí</strong><small>Finaliza tu primera sesión para empezar a medir tu progreso.</small></div>}</section>
  `
})
export class ProgressComponent {
  readonly store = inject(WorkoutStore);
  readonly completedSessions = computed(() => this.store.sessions().filter((session) => session.status === 'completed'));
  readonly totalVolume = computed(() => this.completedSessions().reduce((sum, session) => sum + this.sessionVolume(session), 0));
  readonly completedSets = computed(() => this.completedSessions().reduce((sum, session) => sum + session.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed).length, 0));
  readonly currentMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date());
  readonly calendarDays = computed(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const loggedDays = new Set(this.completedSessions().map((session) => { const date = new Date(session.finishedAt ?? session.startedAt); return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }));
    return Array.from({ length: 35 }, (_, index) => {
      const dayNumber = index - offset + 1;
      const date = new Date(year, month, dayNumber);
      const inCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
      return { label: String(date.getDate()), muted: !inCurrentMonth, done: inCurrentMonth && loggedDays.has(`${year}-${month}-${dayNumber}`) };
    });
  });
  readonly records = computed<PersonalRecordView[]>(() => {
    const bests = new Map<string, PersonalRecordView>();
    for (const session of this.completedSessions()) {
      for (const sessionExercise of session.exercises) {
        const exercise = this.store.exerciseById(sessionExercise.exerciseId);
        for (const set of sessionExercise.sets) {
          if (!set.completed || set.weight === null || set.reps === null) continue;
          const previous = bests.get(sessionExercise.exerciseId);
          if (!previous || set.weight > previous.weight || (set.weight === previous.weight && set.reps > previous.reps)) bests.set(sessionExercise.exerciseId, { exerciseId: sessionExercise.exerciseId, name: exercise?.name ?? 'Ejercicio', weight: set.weight, reps: set.reps, date: session.finishedAt ?? session.startedAt });
        }
      }
    }
    return Array.from(bests.values()).sort((a, b) => b.weight - a.weight);
  });

  sessionVolume(session: WorkoutSession): number { return session.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed && set.weight !== null && set.reps !== null).reduce((sum, set) => sum + (set.weight ?? 0) * (set.reps ?? 0), 0); }
  formatNumber(value: number): string { return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value); }
  sessionDate(value: string): string { return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(value)); }
}
