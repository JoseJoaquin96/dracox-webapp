import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Routine, WorkoutSession } from '../models';
import { currentStreak, muscleDistribution, sessionTimestamp, sessionVolume, sessionsSince, startOfWeek, weekActivity } from '../workout-stats';
import { WorkoutStore } from '../workout.store';

const MUSCLE_COLORS = ['var(--orange)', 'var(--violet)', 'var(--green)', '#72b6ff'];

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-heading dashboard-heading">
      <div>
        <p class="eyebrow">{{ dateLabel }}</p>
        <h1>Entrena con intención, <em>{{ store.userName() }}.</em></h1>
        <p class="heading-subtitle">Tu próximo paso no tiene que ser perfecto. Solo tiene que ser el siguiente.</p>
      </div>
      <a class="button button-primary heading-cta" [routerLink]="startLink()">{{ nextRoutine() ? 'Comenzar entrenamiento' : 'Crear rutina' }} <span>↗</span></a>
    </div>

    <section class="hero-grid">
      <article class="next-session-card surface-card">
        <div class="card-topline"><span class="card-kicker"><span class="pulse-dot"></span> Próxima sesión</span></div>
        @if (nextRoutine(); as routine) {
          <div class="next-session-content">
            <div><span class="routine-pill" [style.color]="routine.color">{{ routine.days }}</span><h2>{{ routine.name }}</h2><p>{{ routine.focus }}</p></div>
            <div class="session-orb"><span>{{ routine.exercises.length }}</span><small>bloques</small></div>
          </div>
          <div class="session-meta"><span>◷ {{ routine.duration }} min</span><span>▤ {{ plannedSets(routine) }} series</span><span>◌ {{ routine.routineDays?.length || 1 }} día{{ (routine.routineDays?.length || 1) === 1 ? '' : 's' }}</span></div>
          <a class="card-action" [routerLink]="startLink()">Ver sesión <span>→</span></a>
        } @else {
          <div class="next-session-content">
            <div><span class="routine-pill">Hoy</span><h2>Nueva rutina</h2><p>Empieza a diseñar tu semana</p></div>
            <div class="session-orb"><span>0</span><small>bloques</small></div>
          </div>
          <a class="card-action" routerLink="/routines">Crear rutina <span>→</span></a>
        }
      </article>

      <article class="quote-card surface-card"><span class="quote-mark">“</span><p>La disciplina es elegir entre lo que quieres ahora y lo que más quieres.</p><div class="quote-footer"><span class="quote-line"></span><small>Tu recordatorio de hoy</small></div></article>
    </section>

    <section class="stats-grid">
      <article class="metric-card surface-card">
        <div class="metric-label"><span class="metric-icon lime">↗</span><span>Volumen esta semana</span><span class="trend positive">{{ weekSessions().length }} sesiones</span></div>
        <strong>{{ formatNumber(weekVolume()) }} <small>kg</small></strong>
        <div class="mini-sparkline">@for (day of week(); track day.label) { <i [class.today]="day.isToday" [style.height.%]="barHeight(day.volume, maxDayVolume())"></i> }</div>
        <small class="metric-foot">Calculado desde tus series completadas</small>
      </article>
      <article class="metric-card surface-card">
        <div class="metric-label"><span class="metric-icon violet">◷</span><span>Tiempo entrenado</span><span class="trend positive">{{ weekSessions().length }} sesiones</span></div>
        <strong>{{ weekMinutes() }} <small>min</small></strong>
        <div class="mini-sparkline violet-spark">@for (day of week(); track day.label) { <i [class.today]="day.isToday" [style.height.%]="barHeight(day.minutes, maxDayMinutes())"></i> }</div>
        <small class="metric-foot">Solo cuenta sesiones finalizadas esta semana</small>
      </article>
      <article class="metric-card surface-card streak-card">
        <div class="metric-label"><span class="metric-icon orange">✦</span><span>Racha actual</span><span class="trend neutral">Días seguidos</span></div>
        <strong>{{ streak() }} <small>día{{ streak() === 1 ? '' : 's' }}</small></strong>
        <div class="streak-dots">@for (dot of streakDots; track dot) { <i [class.filled]="dot < streak()" [class.current]="dot === streak() - 1"></i> }</div>
        <small class="metric-foot">Un día cada vez</small>
      </article>
    </section>

    <section class="content-grid two-column-grid">
      <article class="surface-card chart-card">
        <div class="section-heading"><div><span class="eyebrow">Ritmo semanal</span><h3>Actividad de entrenamiento</h3></div><span class="calendar-month">Esta semana</span></div>
        <div class="chart-area">
          <div class="y-axis">@for (tick of yTicks(); track $index) { <span>{{ tick }}</span> }</div>
          <div class="bars">@for (day of week(); track day.label) {<div class="bar-column"><i class="bar" [class.light]="!day.sessions" [class.today]="day.isToday" [style.height.%]="barHeight(day.sessions, chartMax())" [attr.title]="day.sessions + ' sesiones'"></i><span>{{ day.label }}</span></div>}</div>
        </div>
      </article>
      <article class="surface-card muscle-card">
        <div class="section-heading"><div><span class="eyebrow">Distribución semanal</span><h3>Grupos musculares</h3></div><a class="text-link" routerLink="/progress">Ver todo →</a></div>
        <div class="muscle-list">
          @for (row of muscles(); track row.muscle; let index = $index) {
            <div class="muscle-row"><span class="muscle-name"><i class="muscle-dot" [style.background]="muscleColor(index)"></i>{{ row.muscle }}</span><strong>{{ row.sets }} <small>series</small></strong><span class="progress-track"><i [style.width.%]="barHeight(row.sets, muscles()[0].sets)"></i></span></div>
          } @empty {
            <p class="metric-foot">Completa series esta semana para ver cómo se reparten.</p>
          }
        </div>
      </article>
    </section>

    <section class="surface-card recent-card"><div class="section-heading"><div><span class="eyebrow">Historial</span><h3>Últimos entrenamientos</h3></div><a class="text-link" routerLink="/progress">Ver historial →</a></div><div class="recent-list">@for (session of recentSessions(); track session.id) {<div class="recent-item"><span class="recent-avatar push">{{ session.name.slice(0, 1) }}</span><div><strong>{{ session.name }}</strong><small>{{ sessionDate(session) }} · {{ session.durationMinutes ?? 0 }} min · Sesión completada</small></div><span class="recent-volume">{{ formatNumber(volume(session)) }} kg</span><span class="recent-check">✓</span></div>} @empty {<div class="dashboard-empty-history"><span>◌</span><div><strong>Aún no hay entrenamientos guardados</strong><small>Completa tu primera sesión y aparecerá aquí.</small></div><a class="text-link" [routerLink]="startLink()">Empezar →</a></div>}</div></section>
  `
})
export class DashboardComponent {
  readonly store = inject(WorkoutStore);
  private readonly now = new Date();
  readonly streakDots = [0, 1, 2, 3, 4, 5, 6];
  readonly nextRoutine = computed<Routine | null>(() => this.store.activeRoutines()[0] ?? null);
  readonly startLink = computed(() => {
    const routine = this.nextRoutine();
    return routine ? ['/workout', routine.id] : ['/routines'];
  });
  readonly completedSessions = computed(() => this.store.sessions().filter((session) => session.status === 'completed'));
  readonly recentSessions = computed(() => this.completedSessions().slice(0, 4));
  readonly weekSessions = computed(() => sessionsSince(this.completedSessions(), startOfWeek(this.now)));
  readonly week = computed(() => weekActivity(this.weekSessions(), this.now));
  readonly weekVolume = computed(() => this.week().reduce((sum, day) => sum + day.volume, 0));
  readonly weekMinutes = computed(() => this.week().reduce((sum, day) => sum + day.minutes, 0));
  readonly maxDayVolume = computed(() => Math.max(...this.week().map((day) => day.volume)));
  readonly maxDayMinutes = computed(() => Math.max(...this.week().map((day) => day.minutes)));
  readonly chartMax = computed(() => Math.max(4, ...this.week().map((day) => day.sessions)));
  readonly yTicks = computed(() => [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(this.chartMax() * ratio * 10) / 10));
  readonly streak = computed(() => currentStreak(this.completedSessions(), this.now));
  readonly muscles = computed(() => muscleDistribution(this.weekSessions(), (id) => this.store.exerciseById(id)?.muscle).slice(0, 4));
  readonly dateLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(this.now);
  private readonly numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
  private readonly shortDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });

  plannedSets(routine: Routine): number { return routine.exercises.reduce((sum, exercise) => sum + exercise.sets, 0); }
  volume(session: WorkoutSession): number { return sessionVolume(session); }
  formatNumber(value: number): string { return this.numberFormat.format(value); }
  sessionDate(session: WorkoutSession): string { return this.shortDate.format(new Date(sessionTimestamp(session))); }
  barHeight(value: number, max: number): number { return max > 0 ? Math.round(value / max * 100) : 0; }
  muscleColor(index: number): string { return MUSCLE_COLORS[index % MUSCLE_COLORS.length]; }
}
