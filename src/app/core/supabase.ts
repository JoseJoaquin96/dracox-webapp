import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError, RemoteError } from './errors';

type RuntimeConfig = { url?: string; publishableKey?: string };

let client: SupabaseClient | null = null;

/** Reads `assets/supabase-config.json`, generated at deploy time so keys never live in the repo. */
export async function loadSupabaseConfig(): Promise<void> {
  try {
    const response = await fetch(new URL('assets/supabase-config.json', document.baseURI), { cache: 'no-store' });
    if (!response.ok) return;
    const config = await response.json() as RuntimeConfig;
    if (config.url && config.publishableKey) client = createClient(config.url, config.publishableKey);
  } catch {
    // Without config the login page explains how to set it up.
  }
}

export function isSupabaseConfigured(): boolean {
  return client !== null;
}

export function supabase(): SupabaseClient {
  if (!client) throw new AppError('Supabase no está configurado.');
  return client;
}

/** Returns the data of a Supabase response or throws its error. */
export function unwrap<T>(response: { data: T; error: { message: string; code?: string } | null }): T {
  if (response.error) throw new RemoteError(response.error.message, response.error.code);
  return response.data;
}
