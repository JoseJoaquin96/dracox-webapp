import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { isSupabaseConfigured } from '../../core/supabase';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const SUBTITLES: Record<AuthMode, string> = {
  login: 'Inicia sesión para consultar tus rutinas y guardar tu progreso.',
  register: 'Crea tu cuenta para guardar tus rutinas y tu progreso.',
  forgot: 'Te enviaremos un enlace para recuperar el acceso.',
  reset: 'Elige una contraseña nueva para proteger tu cuenta.'
};

const MIN_PASSWORD_LENGTH = 8;

@Component({
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly supabaseConfigured = isSupabaseConfigured();
  readonly minPasswordLength = MIN_PASSWORD_LENGTH;
  readonly mode = signal<AuthMode>(this.route.snapshot.queryParamMap.get('mode') === 'reset' ? 'reset' : 'login');
  readonly subtitle = computed(() => SUBTITLES[this.mode()]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  email = '';
  displayName = '';
  password = '';
  confirmPassword = '';

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set(null);
    this.success.set(null);
    this.password = '';
    this.confirmPassword = '';
  }

  passwordPairValid(): boolean {
    return this.password.length >= MIN_PASSWORD_LENGTH && this.password === this.confirmPassword;
  }

  signIn(): Promise<void> {
    return this.submit(async () => {
      const error = await this.auth.signIn(this.email.trim(), this.password);
      if (error) return error;
      await this.router.navigateByUrl(this.redirectTarget());
      return null;
    });
  }

  register(): Promise<void> {
    return this.submit(async () => {
      const result = await this.auth.signUp(this.email.trim(), this.password, this.displayName);
      if (result.error) return result.error;
      if (!result.needsConfirmation) {
        await this.router.navigateByUrl(this.redirectTarget());
        return null;
      }
      this.setMode('login');
      this.success.set('Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.');
      return null;
    });
  }

  requestReset(): Promise<void> {
    return this.submit(async () => {
      const error = await this.auth.requestPasswordReset(this.email.trim());
      if (!error) this.success.set('Si el correo existe, recibirás un enlace para recuperar tu cuenta.');
      return error;
    });
  }

  resetPassword(): Promise<void> {
    return this.submit(async () => {
      const error = await this.auth.updatePassword(this.password);
      if (!error) await this.router.navigateByUrl('/');
      return error;
    });
  }

  /** Runs a form action that resolves to an error message (or null on success). */
  private async submit(action: () => Promise<string | null>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    this.error.set(await action());
    this.busy.set(false);
  }

  private redirectTarget(): string {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    // Only same-app paths, to avoid open redirects.
    return redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
  }
}
