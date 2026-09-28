import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppErrorLog } from '../models';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-heading compact-heading">
      <div><p class="eyebrow">Administración</p><h1>Registro de <em>errores.</em></h1><p class="heading-subtitle">Últimos fallos capturados por la aplicación para poder detectar problemas reales de uso.</p></div>
      <button class="button button-outline" type="button" (click)="refresh()" [disabled]="busy()">{{ busy() ? 'Cargando…' : 'Actualizar' }}</button>
    </div>

    @if (!store.isAdmin()) {
      <section class="empty-state surface-card"><span>!</span><h2>Sin acceso</h2><p>Tu cuenta no tiene permisos de administrador.</p><a class="button button-primary" routerLink="/">Volver al inicio</a></section>
    } @else {
      <section class="surface-card error-log-card">
        <div class="section-heading"><div><span class="eyebrow">Observabilidad</span><h3>{{ store.errorLogs().length }} registros recientes</h3></div><span class="calendar-month">Máximo 200</span></div>
        @for (log of store.errorLogs(); track log.id) {
          <article class="error-log-row">
            <span class="error-log-severity" [class.warning]="log.severity === 'warning'">{{ log.severity }}</span>
            <div class="error-log-copy"><strong>{{ log.message }}</strong><small>{{ formatDate(log) }} · {{ log.source }}{{ log.route ? ' · ' + log.route : '' }}</small>@if (log.details) { <code>{{ formatDetails(log.details) }}</code> }</div>
          </article>
        } @empty {
          <div class="progress-empty"><span>✓</span><strong>No hay errores registrados</strong><small>Los nuevos errores aparecerán aquí cuando ocurran.</small></div>
        }
      </section>
    }
  `
})
export class AdminErrorsComponent {
  readonly store = inject(WorkoutStore);
  readonly busy = signal(false);

  constructor() { void this.refresh(); }

  async refresh(): Promise<void> {
    await this.store.waitUntilReady();
    if (!this.store.isAdmin() || this.busy()) return;
    this.busy.set(true);
    await this.store.loadAdminErrorLogs();
    this.busy.set(false);
  }

  formatDate(log: AppErrorLog): string {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(log.createdAt));
  }

  formatDetails(details: Record<string, unknown>): string { return JSON.stringify(details); }
}
