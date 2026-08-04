import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutSession } from '../models';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-heading dashboard-heading">
      <div>
        <p class="eyebrow">{{ dateLabel }}</p>
        <h1>Entrena con intención, <em>José.</em></h1>
        <p class="heading-subtitle">Tu próximo paso no tiene que ser perfecto. Solo tiene que ser el siguiente.</p>
      </div>
      <a class="button button-primary heading-cta" [routerLink]="['/workout', nextRoutine().id]">Comenzar entrenamiento <span>↗</span></a>
    </div>

    <section class="hero-grid">
      <article class="next-session-card surface-card">
        <div class="card-topline"><span class="card-kicker"><span class="pulse-dot"></span> Próxima sesión</span><button class="ghost-icon" aria-label="Más opciones">•••</button></div>
        <div class="next-session-content">
          <div><span class="routine-pill" [style.color]="nextRoutine().color">{{ nextRoutine().days }}</span><h2>{{ nextRoutine().name }}</h2><p>{{ nextRoutine().focus }}</p></div>
          <div class="session-orb"><span>{{ nextRoutine().exercises.length }}</span><small>bloques</small></div>
        </div>
        <div class="session-meta"><span>◷ {{ nextRoutine().duration }} min</span><span>▤ {{ nextRoutine().exercises.length * 3 }} series</span><span>◌ Hipertrofia</span></div>
        <a class="card-action" [routerLink]="['/workout', nextRoutine().id]">Ver sesión <span>→</span></a>
      </article>

      <article class="quote-card surface-card"><span class="quote-mark">“</span><p>La disciplina es elegir entre lo que quieres ahora y lo que más quieres.</p><div class="quote-footer"><span class="quote-line"></span><small>Tu recordatorio de hoy</small></div></article>
    </section>

    <section class="stats-grid">
      <article class="metric-card surface-card"><div class="metric-label"><span class="metric-icon lime">↗</span><span>Volumen esta semana</span><span class="trend positive">{{ weekSessionCount() }} sesiones</span></div><strong>{{ formatNumber(weekVolume()) }} <small>kg</small></strong><div class="mini-sparkline"><i></i><i></i><i></i><i></i><i></i><i></i><i class="today"></i></div><small class="metric-foot">Calculado desde tus series completadas</small></article>
      <article class="metric-card surface-card"><div class="metric-label"><span class="metric-icon violet">◷</span><span>Tiempo entrenado</span><span class="trend positive">{{ completedSessions().length }} sesiones</span></div><strong>{{ weekMinutes() }} <small>min</small></strong><div class="mini-sparkline violet-spark"><i></i><i></i><i></i><i></i><i></i><i></i><i class="today"></i></div><small class="metric-foot">Solo cuenta sesiones finalizadas</small></article>
      <article class="metric-card surface-card streak-card"><div class="metric-label"><span class="metric-icon orange">✦</span><span>Racha actual</span><span class="trend neutral">Sesiones registradas</span></div><strong>{{ streak() }} <small>días</small></strong><div class="streak-dots"><i class="filled" [class.current]="streak() > 0"></i><i class="filled" [class.current]="streak() > 1"></i><i class="filled" [class.current]="streak() > 2"></i><i class="filled" [class.current]="streak() > 3"></i><i class="filled" [class.current]="streak() > 4"></i><i [class.filled]="streak() > 5"></i><i [class.filled]="streak() > 6"></i></div><small class="metric-foot">Un día cada vez</small></article>
    </section>

    <section class="content-grid two-column-grid">
      <article class="surface-card chart-card"><div class="section-heading"><div><span class="eyebrow">Ritmo semanal</span><h3>Actividad de entrenamiento</h3></div><button class="filter-button">Esta semana <span>⌄</span></button></div><div class="chart-area"><div class="y-axis"><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><div class="bars"><div class="bar-column"><i class="bar light" style="height: 36%"></i><span>Lun</span></div><div class="bar-column"><i class="bar" style="height: 58%"></i><span>Mar</span></div><div class="bar-column"><i class="bar light" style="height: 22%"></i><span>Mié</span></div><div class="bar-column"><i class="bar" style="height: 80%"></i><span>Jue</span></div><div class="bar-column"><i class="bar light" style="height: 45%"></i><span>Vie</span></div><div class="bar-column"><i class="bar" style="height: 67%"></i><span>Sáb</span></div><div class="bar-column"><i class="bar today" style="height: 92%"></i><span>Dom</span></div></div></div></article>
      <article class="surface-card muscle-card"><div class="section-heading"><div><span class="eyebrow">Distribución</span><h3>Grupos musculares</h3></div><a class="text-link" routerLink="/progress">Ver todo →</a></div><div class="muscle-list"><div class="muscle-row"><span class="muscle-name"><i class="muscle-dot chest"></i>Pecho</span><strong>8 <small>series</small></strong><span class="progress-track"><i style="width: 82%"></i></span></div><div class="muscle-row"><span class="muscle-name"><i class="muscle-dot back"></i>Espalda</span><strong>7 <small>series</small></strong><span class="progress-track"><i style="width: 70%"></i></span></div><div class="muscle-row"><span class="muscle-name"><i class="muscle-dot legs"></i>Piernas</span><strong>6 <small>series</small></strong><span class="progress-track"><i style="width: 60%"></i></span></div><div class="muscle-row"><span class="muscle-name"><i class="muscle-dot shoulders"></i>Hombros</span><strong>4 <small>series</small></strong><span class="progress-track"><i style="width: 40%"></i></span></div></div></article>
    </section>

    <section class="surface-card recent-card"><div class="section-heading"><div><span class="eyebrow">Historial</span><h3>Últimos entrenamientos</h3></div><a class="text-link" routerLink="/progress">Ver historial →</a></div><div class="recent-list">@for (session of recentSessions(); track session.id) {<div class="recent-item"><span class="recent-avatar push">{{ session.name.slice(0, 1) }}</span><div><strong>{{ session.name }}</strong><small>{{ sessionDate(session.finishedAt ?? session.startedAt) }} · {{ session.durationMinutes ?? 0 }} min · Sesión completada</small></div><span class="recent-volume">{{ formatNumber(sessionVolume(session)) }} kg</span><span class="recent-check">✓</span></div>} @empty {<div class="dashboard-empty-history"><span>◌</span><div><strong>Aún no hay entrenamientos guardados</strong><small>Completa tu primera sesión y aparecerá aquí.</small></div><a class="text-link" [routerLink]="['/workout', nextRoutine().id]">Empezar →</a></div>}</div></section>
  `
})
export class DashboardComponent {
  private readonly store = inject(WorkoutStore);
  readonly nextRoutine = computed(() => this.store.routines()[0] ?? { id: '', name: 'Nueva rutina', focus: 'Empieza a diseñar tu semana', days: 'Hoy', duration: 45, color: '#d8f36a', exercises: [] });
  readonly completedSessions = computed(() => this.store.sessions().filter((session) => session.status === 'completed'));
  readonly recentSessions = computed(() => this.completedSessions().slice(0, 4));
  readonly weekSessionCount = computed(() => this.completedSessions().filter((session) => this.isThisWeek(session.finishedAt ?? session.startedAt)).length);
  readonly weekVolume = computed(() => this.completedSessions().filter((session) => this.isThisWeek(session.finishedAt ?? session.startedAt)).reduce((sum, session) => sum + this.sessionVolume(session), 0));
  readonly weekMinutes = computed(() => this.completedSessions().filter((session) => this.isThisWeek(session.finishedAt ?? session.startedAt)).reduce((sum, session) => sum + (session.durationMinutes ?? 0), 0));
  readonly dateLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  sessionVolume(session: WorkoutSession): number { return session.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed && set.weight !== null && set.reps !== null).reduce((sum, set) => sum + (set.weight ?? 0) * (set.reps ?? 0), 0); }
  formatNumber(value: number): string { return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value); }
  streak(): number { return Math.min(7, new Set(this.completedSessions().map((session) => (session.finishedAt ?? session.startedAt).slice(0, 10))).size); }
  sessionDate(value: string): string { return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(value)); }
  private isThisWeek(value: string): boolean { const date = new Date(value); const now = new Date(); const monday = new Date(now); const day = (now.getDay() + 6) % 7; monday.setDate(now.getDate() - day); monday.setHours(0, 0, 0, 0); return date >= monday; }
}
