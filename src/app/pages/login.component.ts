import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isSupabaseConfigured } from '../supabase.client';
import { WorkoutStore } from '../workout.store';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="login-page">
      <section class="login-card surface-card">
        <div class="brand login-brand"><span class="brand-mark">D</span><span><strong>dracox</strong><small>TRAINING OS</small></span></div>
        <div class="login-heading"><span class="eyebrow">Espacio personal</span><h1>{{ mode() === 'reset' ? 'Crea una nueva' : 'Tu entrenamiento,' }}<br><em>{{ mode() === 'reset' ? 'contraseña segura.' : 'solo para ti.' }}</em></h1><p>{{ headingText() }}</p></div>

        @if (!supabaseConfigured) {
          <div class="login-message login-warning">Falta configurar Supabase. Crea <code>src/assets/supabase-config.json</code> a partir del archivo de ejemplo.</div>
        } @else {
          @if (success(); as message) { <div class="login-message login-success">{{ message }}</div> }
          @if (error()) { <p class="login-error">{{ error() }}</p> }

          @if (mode() === 'login') {
            <form (ngSubmit)="submit()">
              <label class="field-label">Email<input type="email" name="email" [(ngModel)]="email" autocomplete="email" required></label>
              <label class="field-label">Contraseña<input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" required></label>
              <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim() || !password">{{ busy() ? 'Entrando…' : 'Iniciar sesión' }}</button>
              <div class="login-actions"><button class="login-link" type="button" (click)="setMode('forgot')">¿Has olvidado la contraseña?</button></div>
              <p class="auth-switch">¿No tienes cuenta? <button class="login-link" type="button" (click)="setMode('register')">Crear cuenta</button></p>
            </form>
          } @else if (mode() === 'register') {
            <form (ngSubmit)="register()">
              <label class="field-label">Email<input type="email" name="email" [(ngModel)]="email" autocomplete="email" required></label>
              <label class="field-label">Contraseña<input type="password" name="password" [(ngModel)]="password" autocomplete="new-password" minlength="8" required></label>
              <label class="field-label">Repite la contraseña<input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" autocomplete="new-password" minlength="8" required></label>
              @if (password && password.length < 8) { <small class="password-hint">Usa al menos 8 caracteres.</small> }
              @if (confirmPassword && password !== confirmPassword) { <small class="password-hint">Las contraseñas no coinciden.</small> }
              <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim() || !passwordPairValid()">{{ busy() ? 'Creando cuenta…' : 'Crear cuenta' }}</button>
              <p class="auth-switch">¿Ya tienes cuenta? <button class="login-link" type="button" (click)="setMode('login')">Iniciar sesión</button></p>
            </form>
          } @else if (mode() === 'forgot') {
            <form (ngSubmit)="requestReset()">
              <label class="field-label">Email<input type="email" name="email" [(ngModel)]="email" autocomplete="email" required></label>
              <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !email.trim()">{{ busy() ? 'Enviando…' : 'Enviar enlace' }}</button>
              <p class="auth-switch"><button class="login-link" type="button" (click)="setMode('login')">Volver a iniciar sesión</button></p>
            </form>
          } @else {
            <form (ngSubmit)="resetPassword()">
              <label class="field-label">Nueva contraseña<input type="password" name="password" [(ngModel)]="password" autocomplete="new-password" minlength="8" required></label>
              <label class="field-label">Repite la contraseña<input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" autocomplete="new-password" minlength="8" required></label>
              @if (password && password.length < 8) { <small class="password-hint">Usa al menos 8 caracteres.</small> }
              @if (confirmPassword && password !== confirmPassword) { <small class="password-hint">Las contraseñas no coinciden.</small> }
              <button class="button button-primary login-submit" type="submit" [disabled]="busy() || !passwordPairValid()">{{ busy() ? 'Guardando…' : 'Guardar contraseña' }}</button>
            </form>
          }
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
  readonly mode = signal<AuthMode>(this.route.snapshot.queryParamMap.get('mode') === 'reset' ? 'reset' : 'login');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  email = '';
  password = '';
  confirmPassword = '';

  headingText(): string {
    if (this.mode() === 'register') return 'Crea tu cuenta para guardar tus rutinas y tu progreso.';
    if (this.mode() === 'forgot') return 'Te enviaremos un enlace para recuperar el acceso.';
    if (this.mode() === 'reset') return 'Elige una contraseña nueva para proteger tu cuenta.';
    return 'Inicia sesión para consultar tus rutinas y guardar tu progreso.';
  }

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set(null);
    this.success.set(null);
    this.password = '';
    this.confirmPassword = '';
  }

  passwordPairValid(): boolean {
    return this.password.length >= 8 && this.password === this.confirmPassword;
  }

  async submit(): Promise<void> {
    if (!this.email.trim() || !this.password) return;
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    const signedIn = await this.store.signIn(this.email.trim(), this.password);
    this.busy.set(false);
    if (!signedIn) {
      this.error.set(this.store.remoteError() ?? 'No se pudo iniciar sesión.');
      return;
    }
    await this.router.navigateByUrl(this.redirectTarget());
  }

  async register(): Promise<void> {
    if (!this.email.trim() || !this.passwordPairValid()) return;
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    const result = await this.store.signUp(this.email.trim(), this.password);
    this.busy.set(false);
    if (!result.ok) {
      this.error.set(this.store.remoteError() ?? 'No se pudo crear la cuenta.');
      return;
    }
    this.password = '';
    this.confirmPassword = '';
    if (result.needsConfirmation) {
      this.mode.set('login');
      this.success.set('Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.');
      return;
    }
    await this.router.navigateByUrl(this.redirectTarget());
  }

  async requestReset(): Promise<void> {
    if (!this.email.trim()) return;
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    const sent = await this.store.requestPasswordReset(this.email.trim());
    this.busy.set(false);
    if (!sent) {
      this.error.set(this.store.remoteError() ?? 'No se pudo iniciar la recuperación.');
      return;
    }
    this.success.set('Si el correo existe, recibirás un enlace para recuperar tu cuenta.');
  }

  async resetPassword(): Promise<void> {
    if (!this.passwordPairValid()) return;
    this.busy.set(true);
    this.error.set(null);
    const updated = await this.store.updatePassword(this.password);
    this.busy.set(false);
    if (!updated) {
      this.error.set(this.store.remoteError() ?? 'No se pudo actualizar la contraseña.');
      return;
    }
    await this.router.navigateByUrl('/');
  }

  private redirectTarget(): string {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    return redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
  }
}
