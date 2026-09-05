import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isSupabaseConfigured } from '../supabase.client';
import { WorkoutStore } from '../workout.store';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="login-page">
      <section class="login-card surface-card">
        <div class="brand login-brand"><span class="brand-mark">F</span><span><strong>forge</strong><small>TRAINING OS</small></span></div>
        <div class="login-heading"><span class="eyebrow">Espacio personal</span><h1>Tu entrenamiento,<br><em>solo para ti.</em></h1><p>Inicia sesión para consultar tus rutinas y guardar tu progreso.</p></div>

        @if (!supabaseConfigured) {
          <div class="login-message login-warning">Falta configurar Supabase. Crea <code>src/assets/supabase-config.json</code> a partir del archivo de ejemplo.</div>
        } @else {
          <form (ngSubmit)="submit()">
            <label class="field-label">Email<input type="email" name="email" [(ngModel)]="email" autocomplete="email" required></label>
            <label class="field-label">Contraseña<input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" required></label>
            @if (error()) { <p class="login-error">{{ error() }}</p> }
            <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim() || !password">{{ busy() ? 'Entrando…' : 'Iniciar sesión' }}</button>
          </form>
        }
      </section>
    </main>
  `
})
export class LoginComponent {
  private readonly store = inject(WorkoutStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly supabaseConfigured = isSupabaseConfigured();
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  email = '';
  password = '';

  async submit(): Promise<void> {
    if (!this.email.trim() || !this.password) return;
    this.busy.set(true);
    this.error.set(null);
    const signedIn = await this.store.signIn(this.email.trim(), this.password);
    this.busy.set(false);
    if (!signedIn) {
      this.error.set(this.store.remoteError() ?? 'No se pudo iniciar sesión.');
      return;
    }

    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const target = redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
    await this.router.navigateByUrl(target);
  }
}
