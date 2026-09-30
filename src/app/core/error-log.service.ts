import { Injectable, signal } from '@angular/core';
import { AppErrorLog } from '../domain/models';
import { isSupabaseConfigured, supabase, unwrap } from './supabase';

type ErrorLogRow = {
  id: number;
  user_id: string | null;
  severity: AppErrorLog['severity'];
  source: string;
  message: string;
  route: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  private readonly state = signal<AppErrorLog[]>([]);
  readonly logs = this.state.asReadonly();

  async log(message: string, source: string, details: Record<string, unknown> | null = null): Promise<void> {
    try {
      if (!isSupabaseConfigured()) return;
      const { data } = await supabase().auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      await supabase().from('app_error_logs').insert({
        user_id: userId,
        severity: 'error',
        source: source.slice(0, 100),
        message: message.slice(0, 2000),
        route: location.pathname.slice(0, 500),
        details
      });
    } catch {
      // A failing logger must never raise new errors.
    }
  }

  async loadRecent(): Promise<void> {
    const rows = unwrap(await supabase()
      .from('app_error_logs')
      .select('id, user_id, severity, source, message, route, details, created_at')
      .order('created_at', { ascending: false })
      .limit(200)) as ErrorLogRow[];
    this.state.set(rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      severity: row.severity,
      source: row.source,
      message: row.message,
      route: row.route,
      details: row.details,
      createdAt: row.created_at
    })));
  }
}
