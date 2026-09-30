import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../core/auth/auth.store';
import { SyncStatus } from '../core/sync-status';
import { plural } from '../shared/format';
import { WorkoutStore } from '../state/workout.store';

@Component({
  selector: 'dracox-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  readonly auth = inject(AuthStore);
  readonly status = inject(SyncStatus);
  private readonly workout = inject(WorkoutStore);
  private readonly router = inject(Router);
  readonly plural = plural;
  readonly pendingCount = this.workout.unsyncedCount;
  readonly syncLabel = computed(() => {
    if (this.pendingCount()) return 'Pendiente de sincronizar';
    if (this.status.loading()) return 'Sincronizando';
    if (this.status.error()) return 'Error de sincronización';
    return 'Sincronizado';
  });

  constructor() {
    // Covers sign-out from this or another tab, and expired sessions.
    effect(() => {
      if (!this.auth.isAuthenticated()) void this.router.navigateByUrl('/login');
    });
  }
}
