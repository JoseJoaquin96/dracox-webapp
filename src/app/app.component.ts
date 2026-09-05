import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WorkoutStore } from './workout.store';

@Component({
  selector: 'forge-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" routerLink="/" aria-label="Forge inicio">
          <span class="brand-mark">F</span>
          <span><strong>forge</strong><small>TRAINING OS</small></span>
        </a>

        <div class="sidebar-label">Espacio personal</div>
        <nav class="main-nav" aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span class="nav-icon">⌂</span> Hoy</a>
          <a routerLink="/routines" routerLinkActive="active"><span class="nav-icon">▦</span> Rutinas</a>
          <a routerLink="/progress" routerLinkActive="active"><span class="nav-icon">◔</span> Progreso</a>
          <a routerLink="/exercises" routerLinkActive="active"><span class="nav-icon">✦</span> Ejercicios</a>
        </nav>

        <div class="sidebar-bottom">
          <div class="mini-profile"><span class="avatar">J</span><span><strong>José</strong><small>Modo personal</small></span><span class="status-dot"></span></div>
          <div class="sidebar-tip"><span class="tip-icon">✳</span><span><strong>Tu progreso, tu ritmo</strong><small>La constancia gana.</small></span></div>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="mobile-brand"><span class="brand-mark">F</span><strong>forge</strong></div>
          <div class="topbar-actions">
            <span class="sync-pill"><i></i> {{ syncLabel() }}</span>
            <button class="icon-button" aria-label="Notificaciones">♧<span class="notification-dot"></span></button>
            <button class="avatar avatar-button" (click)="signOut()" aria-label="Cerrar sesión" title="Cerrar sesión">J</button>
          </div>
        </header>
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
  private readonly store = inject(WorkoutStore);
  private readonly router = inject(Router);
  readonly routineCount = computed(() => this.store.routines().length);
  readonly syncLabel = computed(() => this.store.isAuthenticated() && this.store.remoteState() === 'ready' ? 'Supabase' : 'Guardado local');

  async signOut(): Promise<void> {
    await this.store.signOut();
    await this.router.navigateByUrl('/login');
  }
}
