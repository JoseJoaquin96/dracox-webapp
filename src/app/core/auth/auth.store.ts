import { Injectable, computed, signal } from '@angular/core';
import type { AuthError, User } from '@supabase/supabase-js';
import { Profile } from '../../domain/models';
import { isOffline } from '../errors';
import { isSupabaseConfigured, supabase } from '../supabase';

type ProfileRow = { is_admin: boolean | null; display_name: string | null };

/** Auth methods resolve to an error message for the user, or null on success. */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly user = signal<User | null>(null);
  private readonly profile = signal<Profile | null>(null);
  readonly userId = computed(() => this.user()?.id ?? null);
  readonly isAuthenticated = computed(() => this.userId() !== null);
  readonly isAdmin = computed(() => this.profile()?.isAdmin ?? false);
  readonly userName = computed(() => this.profile()?.displayName ?? this.user()?.email?.split('@')[0] ?? 'Atleta');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  /** Resolves once the stored session and its profile have been restored. */
  readonly ready = this.restoreSession();

  async signIn(email: string, password: string): Promise<string | null> {
    const { data, error } = await supabase().auth.signInWithPassword({ email, password });
    if (error) return authErrorMessage(error, 'No se pudo iniciar sesión.');
    await this.setUser(data.user);
    return null;
  }

  async signUp(email: string, password: string, displayName: string): Promise<{ error: string | null; needsConfirmation: boolean }> {
    const name = displayName.trim().slice(0, 60);
    const { data, error } = await supabase().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: appUrl('login'), data: name ? { display_name: name } : undefined }
    });
    if (error) return { error: authErrorMessage(error, 'No se pudo crear la cuenta. Comprueba el correo y la contraseña.'), needsConfirmation: false };
    if (data.session) await this.setUser(data.session.user);
    return { error: null, needsConfirmation: !data.session };
  }

  async requestPasswordReset(email: string): Promise<string | null> {
    const { error } = await supabase().auth.resetPasswordForEmail(email, { redirectTo: appUrl('login?mode=reset') });
    return error ? authErrorMessage(error, 'No se pudo iniciar la recuperación. Inténtalo de nuevo.') : null;
  }

  async updatePassword(password: string): Promise<string | null> {
    if (!this.user()) return 'El enlace de recuperación no es válido o ha caducado.';
    const { error } = await supabase().auth.updateUser({ password });
    return error ? authErrorMessage(error, 'No se pudo actualizar la contraseña.') : null;
  }

  async signOut(): Promise<void> {
    await supabase().auth.signOut();
    await this.setUser(null);
  }

  private async restoreSession(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { data } = await supabase().auth.getSession();
    await this.setUser(data.session?.user ?? null);
    supabase().auth.onAuthStateChange((_event, session) => {
      // Deferred: awaiting Supabase inside this callback can deadlock the auth client.
      setTimeout(() => void this.setUser(session?.user ?? null));
    });
  }

  private async setUser(user: User | null): Promise<void> {
    const changed = user?.id !== this.userId();
    this.user.set(user);
    if (changed) this.profile.set(user ? await this.fetchProfile(user.id) : null);
  }

  private async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase().from('profiles').select('is_admin, display_name').eq('id', userId).maybeSingle();
    // No profile (or migration 0006 not applied) just means a regular user.
    if (error || !data) return null;
    const row = data as ProfileRow;
    return { isAdmin: row.is_admin === true, displayName: row.display_name?.trim() || null };
  }
}

function authErrorMessage(error: AuthError, fallback: string): string {
  if (isOffline(error)) return 'Sin conexión. Revisa tu red e inténtalo de nuevo.';
  if (error.code === 'invalid_credentials') return 'Email o contraseña incorrectos.';
  if (error.code === 'email_not_confirmed') return 'Confirma tu email antes de iniciar sesión.';
  return fallback;
}

function appUrl(path: string): string {
  return new URL(path, document.baseURI).toString();
}
