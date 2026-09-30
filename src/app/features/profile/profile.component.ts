import { Component, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/auth/auth.store';
import { plural } from '../../shared/format';
import { WorkoutStore } from '../../state/workout.store';

@Component({
  imports: [FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  readonly auth = inject(AuthStore);
  private readonly workout = inject(WorkoutStore);
  readonly name = linkedSignal(() => this.auth.displayName() ?? '');
  readonly saving = signal(false);
  readonly message = signal<string | null>(null);

  async saveName(): Promise<void> {
    this.saving.set(true);
    const error = await this.auth.updateDisplayName(this.name());
    this.saving.set(false);
    this.message.set(error ?? 'Nombre guardado.');
  }

  async signOut(): Promise<void> {
    const pending = this.workout.unsyncedCount();
    const warning = `Tienes ${pending} ${plural(pending, 'cambio')} sin sincronizar que se perderán. ¿Cerrar sesión igualmente?`;
    if (pending && !window.confirm(warning)) return;
    await this.auth.signOut();
  }
}
