import { createClient, SupabaseClient } from '@supabase/supabase-js';

type RuntimeConfig = {
  url?: string;
  publishableKey?: string;
};

let client: SupabaseClient | null = null;
let configured = false;

export async function loadSupabaseConfig(): Promise<void> {
  try {
    const configUrl = new URL('assets/supabase-config.json', document.baseURI);
    const response = await fetch(configUrl, { cache: 'no-store' });
    if (!response.ok) return;

    const config = await response.json() as RuntimeConfig;
    if (!config.url || !config.publishableKey) return;

    client = createClient(config.url, config.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    configured = true;
  } catch {
    // Keep the prototype usable locally when no runtime config exists.
  }
}

export function getSupabase(): SupabaseClient | null {
  return client;
}

export function isSupabaseConfigured(): boolean {
  return configured;
}
