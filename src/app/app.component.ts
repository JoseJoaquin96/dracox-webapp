import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WorkoutStore } from './workout.store';

@Component({
  selector: 'dracox-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" routerLink="/" aria-label="Dracox inicio">
          <span class="brand-mark">D</span>
          <span><strong>dracox</strong><small>TRAINING OS</small></span>
        </a>

        <div class="sidebar-label">Espacio personal</div>
        <nav class="main-nav" aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span class="nav-icon">⌂</span> Hoy</a>
          <a routerLink="/routines" routerLinkActive="active"><span class="nav-icon">▦</span> Rutinas</a>
          <a routerLink="/progress" routerLinkActive="active"><span class="nav-icon">◔</span> Progreso</a>
          <a routerLink="/exercises" routerLinkActive="active"><span class="nav-icon">✦</span> Ejercicios</a>
          @if (store.isAdmin()) { <a routerLink="/admin/errors" routerLinkActive="active"><span class="nav-icon">!</span> Admin</a> }
        </nav>

        <div class="sidebar-bottom">
          <div class="mini-profile"><span class="avatar">{{ store.userInitial() }}</span><span><strong>{{ store.userName() }}</strong><small>Modo personal</small></span><span class="status-dot"></span></div>
          <div class="sidebar-tip"><span class="tip-icon">✳</span><span><strong>Tu progreso, tu ritmo</strong><small>La constancia gana.</small></span></div>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="mobile-brand"><span class="brand-mark">D</span><strong>dracox</strong></div>
          <div class="topbar-actions">
            <span class="sync-pill"><i></i> {{ syncLabel() }}</span>
            <button class="avatar avatar-button" (click)="signOut()" aria-label="Cerrar sesión" title="Cerrar sesión">{{ store.userInitial() }}</button>
          </div>
        </header>
        @if (store.remoteState() === 'loading') { <div class="app-status app-status-loading" role="status">Sincronizando datos…</div> }
        @if (store.remoteError(); as error) { <div class="app-status app-status-error" role="alert"><span>{{ error }}</span><button type="button" (click)="store.clearRemoteError()" aria-label="Cerrar aviso">×</button></div> }
        @if (store.pendingWrites() > 0) { <div class="app-status app-status-pending" role="status">{{ store.pendingWrites() }} cambio{{ store.pendingWrites() === 1 ? '' : 's' }} pendiente{{ store.pendingWrites() === 1 ? '' : 's' }} de sincronizar.</div> }
        <div class="page-container"><router-outlet /></div>
      </main>

      <nav class="mobile-nav" aria-label="Navegación móvil">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span>⌂</span>Hoy</a>
        <a routerLink="/routines" routerLinkActive="active"><span>▦</span>Rutinas</a>
        <a class="mobile-action" routerLink="/routines"><span>＋</span></a>
        <a routerLink="/progress" routerLinkActive="active"><span>◔</span>Progreso</a>
        <a routerLink="/exercises" routerLinkActive="active"><span>✦</span>Más</a>
      </nav>
    </div>
  `
})
export class AppComponent {
  readonly store = inject(WorkoutStore);
  private readonly router = inject(Router);
  readonly syncLabel = computed(() => {
    if (this.store.pendingWrites() > 0) return 'Pendiente de sincronizar';
    if (this.store.remoteState() === 'loading') return 'Sincronizando';
    if (this.store.remoteState() === 'error') return 'Error de sincronización';
    if (this.store.remoteState() === 'disabled') return 'Modo local';
    return this.store.isAuthenticated() ? 'Supabase' : 'Sin sincronizar';
  });

  constructor() {
    window.addEventListener('online', this.retryPendingWrites);
    window.addEventListener('error', this.captureWindowError);
    window.addEventListener('unhandledrejection', this.captureRejectedPromise);

    // Session expired or closed in another tab.
    let wasAuthenticated = false;
    effect(() => {
      const authenticated = this.store.isAuthenticated();
      if (wasAuthenticated && !authenticated) void this.router.navigateByUrl('/login');
      wasAuthenticated = authenticated;
    });
  }

  private readonly retryPendingWrites = (): void => { void this.store.retryPendingWrites(); };
  private readonly captureWindowError = (event: ErrorEvent): void => {
    void this.store.logClientError(event.message || 'Error de ventana', 'window.error', {
      filename: event.filename,
      line: event.lineno,
      column: event.colno
    });
  };
  private readonly captureRejectedPromise = (event: PromiseRejectionEvent): void => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    void this.store.logClientError(reason, 'unhandledrejection');
  };

  async signOut(): Promise<void> {
    const pending = this.store.pendingWrites();
    if (pending > 0 && !window.confirm(`Tienes ${pending} cambio${pending === 1 ? '' : 's'} sin sincronizar que se perderán. ¿Cerrar sesión igualmente?`)) return;
    await this.store.signOut();
    await this.router.navigateByUrl('/login');
  }
}
