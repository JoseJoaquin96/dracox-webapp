import { Injectable, computed, signal } from '@angular/core';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AppErrorLog, Exercise, ExerciseKind, Routine, RoutineDay, RoutineExercise, WorkoutSession, WorkoutSet } from './models';
import { getSupabase, isSupabaseConfigured } from './supabase.client';

export type RoutineDraft = {
  name: string;
  focus: string;
  duration: number;
  color: string;
  routineDays: RoutineDay[];
};

type RemoteRoutineExercise = {
  exercise_id: string;
  routine_day_id: string | null;
  day_name: string | null;
  day_position: number | null;
  sets: number;
  rep_range: string;
  rest_seconds: number;
  note: string | null;
  exercise: Exercise | null;
};

type RemoteRoutine = {
  id: string;
  name: string;
  focus: string;
  days: string;
  duration: number;
  color: string;
  exercises: RemoteRoutineExercise[];
};

type RemoteRoutineStatus = { id: string; archived_at: string | null };
type RemoteRoutineDay = { id: string; routine_id: string; name: string; position: number };

type RemoteWorkoutSet = {
  id: string;
  position: number;
  weight: number | null;
  reps: number | null;
  target: string;
  completed: boolean;
};

type RemoteSessionExercise = {
  id: string;
  exercise_id: string;
  position: number;
  note: string | null;
  sets: RemoteWorkoutSet[];
};

type RemoteSession = {
  id?: string;
  session_id?: string;
  routine_id: string;
  routine_name?: string;
  name?: string;
  routine_day_id: string | null;
  day_name: string | null;
  started_at: string;
  finished_at: string | null;
  duration_minutes: number | null;
  status?: 'active' | 'completed';
  exercises: RemoteSessionExercise[];
};

type RemoteState = 'disabled' | 'signed-out' | 'loading' | 'ready' | 'error';

type PendingSetUpdate = {
  sessionId: string;
  sessionExerciseId: string;
  setId: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
};

type CacheSnapshot = {
  exercises: Exercise[];
  routines: Routine[];
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  pendingSetUpdates: PendingSetUpdate[];
};

type ScheduledSetWrite = { sessionExerciseId: string; timer: ReturnType<typeof setTimeout> };

const CACHE_PREFIX = 'dracox-workout-cache:';
const SET_WRITE_DEBOUNCE_MS = 600;

@Injectable({ providedIn: 'root' })
export class WorkoutStore {
  readonly exercises = signal<Exercise[]>([]);
  readonly routines = signal<Routine[]>([]);
  readonly sessions = signal<WorkoutSession[]>([]);
  readonly activeSession = signal<WorkoutSession | null>(null);
  readonly remoteState = signal<RemoteState>(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  readonly remoteError = signal<string | null>(null);
  readonly authEmail = signal<string | null>(null);
  readonly authUserId = signal<string | null>(null);
  readonly displayName = signal<string | null>(null);
  readonly isAdmin = signal(false);
  readonly errorLogs = signal<AppErrorLog[]>([]);
  readonly pendingSetUpdates = signal<PendingSetUpdate[]>([]);
  readonly pendingWrites = computed(() => this.pendingSetUpdates().length);
  readonly isAuthenticated = computed(() => this.authEmail() !== null);
  readonly userName = computed(() => this.displayName() ?? this.authEmail()?.split('@')[0] ?? 'Atleta');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  readonly activeRoutines = computed(() => this.routines().filter((routine) => !routine.archivedAt));
  readonly archivedRoutines = computed(() => this.routines().filter((routine) => Boolean(routine.archivedAt)));
  private readonly exerciseMap = computed(() => new Map(this.exercises().map((exercise) => [exercise.id, exercise])));
  private readonly initialLoad: Promise<void>;
  private readonly setWriteTimers = new Map<string, ScheduledSetWrite>();
  private readonly setWriteQueue = new Map<string, Promise<void>>();
  // Bumped on every local edit so late server responses never overwrite newer values.
  private readonly setVersions = new Map<string, number>();

  constructor() {
    this.initialLoad = this.refreshFromSupabase();
    getSupabase()?.auth.onAuthStateChange((event, session) => {
      // Deferred: awaiting Supabase calls inside this callback can deadlock the auth client.
      setTimeout(() => this.handleAuthChange(event, session), 0);
    });
  }

  private handleAuthChange(event: AuthChangeEvent, session: Session | null): void {
    const currentUserId = this.authUserId();
    if (event === 'SIGNED_OUT') {
      if (currentUserId) this.resetState();
      return;
    }
    if (!session || !currentUserId) return;
    if (session.user.id !== currentUserId) {
      this.resetState();
      this.authUserId.set(session.user.id);
      this.authEmail.set(session.user.email ?? null);
      void this.loadRemoteData();
      return;
    }
    this.authEmail.set(session.user.email ?? null);
  }

  async waitUntilReady(): Promise<void> { await this.initialLoad; }

  async signIn(email: string, password: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) {
      this.remoteState.set('disabled');
      this.remoteError.set('Supabase no está configurado.');
      return false;
    }

    this.remoteState.set('loading');
    this.remoteError.set(null);
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set(error.message);
      return false;
    }

    this.authUserId.set(data.user?.id ?? null);
    this.authEmail.set(data.user?.email ?? email);
    await this.loadRemoteData();
    return this.remoteState() === 'ready';
  }

  async signUp(email: string, password: string, displayName = ''): Promise<{ ok: boolean; needsConfirmation: boolean }> {
    const client = getSupabase();
    if (!client) {
      this.remoteState.set('disabled');
      this.remoteError.set('Supabase no está configurado.');
      return { ok: false, needsConfirmation: false };
    }

    this.remoteState.set('loading');
    this.remoteError.set(null);
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: this.authRedirect('login'),
        data: displayName.trim() ? { display_name: displayName.trim().slice(0, 60) } : undefined
      }
    });
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set('No se pudo crear la cuenta. Comprueba el correo y la contraseña.');
      return { ok: false, needsConfirmation: false };
    }

    if (data.session && data.user) {
      this.authUserId.set(data.user.id);
      this.authEmail.set(data.user.email ?? email);
      await this.loadRemoteData();
    } else {
      this.remoteState.set('signed-out');
    }
    return { ok: true, needsConfirmation: !data.session };
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) {
      this.remoteState.set('disabled');
      this.remoteError.set('Supabase no está configurado.');
      return false;
    }

    this.remoteState.set('loading');
    this.remoteError.set(null);
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: this.authRedirect('login?mode=reset')
    });
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set('No se pudo iniciar la recuperación. Inténtalo de nuevo.');
      return false;
    }
    this.remoteState.set('signed-out');
    return true;
  }

  async updatePassword(password: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) {
      this.remoteState.set('disabled');
      this.remoteError.set('Supabase no está configurado.');
      return false;
    }

    this.remoteState.set('loading');
    this.remoteError.set(null);
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      this.remoteState.set('error');
      this.remoteError.set('El enlace de recuperación no es válido o ha caducado.');
      return false;
    }

    const { error } = await client.auth.updateUser({ password });
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set('No se pudo actualizar la contraseña.');
      return false;
    }
    this.remoteState.set('ready');
    return true;
  }

  async signOut(): Promise<void> {
    const cacheKey = this.cacheKey();
    const client = getSupabase();
    if (client) await client.auth.signOut();
    this.clearCache(cacheKey);
    this.resetState();
  }

  private resetState(): void {
    this.setWriteTimers.forEach(({ timer }) => clearTimeout(timer));
    this.setWriteTimers.clear();
    this.setVersions.clear();
    this.authEmail.set(null);
    this.authUserId.set(null);
    this.displayName.set(null);
    this.isAdmin.set(false);
    this.errorLogs.set([]);
    this.pendingSetUpdates.set([]);
    this.exercises.set([]);
    this.routines.set([]);
    this.sessions.set([]);
    this.activeSession.set(null);
    this.remoteError.set(null);
    this.remoteState.set(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  }

  clearRemoteError(): void { this.remoteError.set(null); }

  private async refreshFromSupabase(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client.auth.getSession();
    if (error) {
      this.fail(error.message);
      return;
    }

    this.authUserId.set(data.session?.user.id ?? null);
    this.authEmail.set(data.session?.user.email ?? null);
    if (data.session) await this.loadRemoteData();
  }

  private async loadRemoteData(): Promise<void> {
    this.remoteState.set('loading');
    const hasCache = this.hydrateCache();
    await Promise.all([
      this.loadRemoteProfile(),
      this.loadRemoteExercises(),
      this.loadRemoteRoutines(),
      this.loadRemoteHistory(),
      this.loadRemoteActiveSession()
    ]);
    await this.retryPendingWrites();
    this.persistCache();
    if (this.remoteState() !== 'error') this.remoteState.set('ready');
    else if (hasCache) this.remoteError.set(this.remoteError() ?? 'Sin conexión. Mostrando la última copia guardada.');
  }

  private async loadRemoteProfile(): Promise<void> {
    const client = getSupabase();
    if (!client || !this.authUserId()) return;
    const { data, error } = await client.from('profiles').select('is_admin, display_name').eq('id', this.authUserId()).maybeSingle();
    if (error) {
      // The admin migration is optional for the core workout loop.
      this.isAdmin.set(false);
      return;
    }
    const profile = data as { is_admin?: boolean; display_name?: string | null } | null;
    this.isAdmin.set(Boolean(profile?.is_admin));
    this.displayName.set(profile?.display_name?.trim() || null);
  }

  private async loadRemoteExercises(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client
      .from('exercises')
      .select('id,name,muscle,secondary,equipment,kind,initials,color')
      .order('name');
    if (error) {
      this.fail(error.message);
      return;
    }
    this.exercises.set((data ?? []) as Exercise[]);
    this.persistCache();
  }

  private async loadRemoteRoutines(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client.rpc('get_my_routines');
    if (error) {
      this.fail(error.message);
      return;
    }

    const [{ data: statuses, error: statusError }, { data: days, error: daysError }] = await Promise.all([
      client.from('routines').select('id, archived_at'),
      client.from('routine_days').select('id, routine_id, name, position').order('position')
    ]);
    if (statusError || daysError) {
      this.fail(statusError?.message ?? daysError?.message ?? 'No se pudieron leer las rutinas.');
      return;
    }

    const routineStatuses = new Map(
      ((statuses ?? []) as RemoteRoutineStatus[]).map((routine) => [routine.id, routine.archived_at])
    );
    const routineDays = new Map<string, RoutineDay[]>();
    ((days ?? []) as RemoteRoutineDay[]).forEach((day) => {
      const list = routineDays.get(day.routine_id) ?? [];
      list.push({ id: day.id, name: day.name, position: day.position, exercises: [] });
      routineDays.set(day.routine_id, list);
    });

    const remoteRoutines = (data ?? []) as RemoteRoutine[];
    remoteRoutines.forEach((routine) => {
      const daysForRoutine = routineDays.get(routine.id) ?? [];
      const dayById = new Map(daysForRoutine.map((day) => [day.id, day]));
      routine.exercises.forEach((planned) => {
        const day = planned.routine_day_id ? dayById.get(planned.routine_day_id) : undefined;
        const exercise: RoutineExercise = {
          exerciseId: planned.exercise_id,
          sets: planned.sets,
          repRange: planned.rep_range,
          restSeconds: planned.rest_seconds,
          note: planned.note ?? undefined
        };
        if (day) day.exercises.push(exercise);
      });

      if (!daysForRoutine.length && routine.exercises.length) {
        routineDays.set(routine.id, [{ name: routine.days || 'Día 1', position: 0, exercises: routine.exercises.map((planned) => ({
          exerciseId: planned.exercise_id,
          sets: planned.sets,
          repRange: planned.rep_range,
          restSeconds: planned.rest_seconds,
          note: planned.note ?? undefined
        })) }]);
      }
    });

    this.routines.set(remoteRoutines.map((routine) => {
      const routineDayList = routineDays.get(routine.id) ?? [];
      return {
        id: routine.id,
        name: routine.name,
        focus: routine.focus,
        days: routine.days,
        duration: routine.duration,
        color: routine.color,
        archivedAt: routineStatuses.get(routine.id) ?? null,
        routineDays: routineDayList.sort((a, b) => a.position - b.position),
        exercises: routineDayList.flatMap((day) => day.exercises)
      };
    }));
    this.persistCache();
  }

  private async loadRemoteHistory(): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    const { data, error } = await client.rpc('get_my_workout_history', { p_routine_id: null });
    if (error) {
      this.fail(error.message);
      return;
    }
    this.sessions.set(((data ?? []) as RemoteSession[]).map((session) => this.mapRemoteSession(session)));
    this.persistCache();
  }

  private async loadRemoteActiveSession(sessionId: string | null = null): Promise<WorkoutSession | null> {
    const client = getSupabase();
    if (!client) return null;
    const { data, error } = await client.rpc('get_my_active_workout', { p_session_id: sessionId });
    if (error) {
      this.fail(error.message);
      return null;
    }
    const session = data ? this.mapRemoteSession(data as RemoteSession) : null;
    this.activeSession.set(session);
    this.persistCache();
    return session;
  }

  private mapRemoteSession(raw: RemoteSession): WorkoutSession {
    return {
      id: raw.id ?? raw.session_id ?? '',
      routineId: raw.routine_id,
      routineDayId: raw.routine_day_id ?? undefined,
      dayName: raw.day_name ?? undefined,
      name: raw.routine_name ?? raw.name ?? 'Entrenamiento',
      startedAt: raw.started_at,
      finishedAt: raw.finished_at ?? undefined,
      durationMinutes: raw.duration_minutes ?? undefined,
      status: raw.status ?? (raw.finished_at ? 'completed' : 'active'),
      exercises: (raw.exercises ?? []).map((exercise) => ({
        id: exercise.id,
        exerciseId: exercise.exercise_id,
        note: exercise.note ?? undefined,
        sets: (exercise.sets ?? []).map((set) => ({
          id: set.id,
          weight: set.weight,
          reps: set.reps,
          target: set.target,
          completed: set.completed
        }))
      }))
    };
  }

  async logClientError(message: string, source = 'client', details: Record<string, unknown> | null = null): Promise<void> {
    const client = getSupabase();
    const userId = this.authUserId();
    if (!client || !userId) return;
    try {
      await client.from('app_error_logs').insert({
        user_id: userId,
        severity: 'error',
        source: source.slice(0, 100),
        message: message.slice(0, 2000),
        route: typeof location === 'undefined' ? null : location.pathname.slice(0, 500),
        details
      });
    } catch {
      // Logging must never raise new errors, or window handlers would loop.
    }
  }

  async loadAdminErrorLogs(): Promise<boolean> {
    const client = getSupabase();
    if (!client || !this.isAdmin()) return false;
    const { data, error } = await client
      .from('app_error_logs')
      .select('id,user_id,severity,source,message,route,details,created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      this.fail(error.message, 'admin-errors');
      return false;
    }
    this.errorLogs.set(((data ?? []) as Array<Record<string, unknown>>).map((log) => ({
      id: Number(log['id']),
      userId: (log['user_id'] as string | null) ?? null,
      severity: (log['severity'] as AppErrorLog['severity']) ?? 'error',
      source: String(log['source'] ?? 'client'),
      message: String(log['message'] ?? ''),
      route: (log['route'] as string | null) ?? null,
      details: (log['details'] as Record<string, unknown> | null) ?? null,
      createdAt: String(log['created_at'] ?? '')
    })));
    return true;
  }

  async retryPendingWrites(): Promise<void> {
    const session = this.activeSession();
    if (!getSupabase() || !session || !this.pendingSetUpdates().length) return;
    // Sets with a scheduled write will send their latest local values anyway.
    const updates = this.pendingSetUpdates().filter((update) => update.sessionId === session.id && !this.setWriteTimers.has(update.setId));
    await Promise.all(updates.map((update) => this.runSetWrite(update.setId, async () => {
      if (this.pendingSetUpdates().includes(update)) await this.sendSetUpdate(update);
    })));
    this.persistCache();
    if (!this.pendingSetUpdates().length) this.clearRemoteError();
  }

  private applySavedSet(sessionExerciseId: string, setId: string, saved: RemoteWorkoutSet): void {
    this.activeSession.update((session) => session ? {
      ...session,
      exercises: session.exercises.map((exercise) => exercise.id !== sessionExerciseId ? exercise : {
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : {
          ...set,
          weight: saved.weight,
          reps: saved.reps,
          completed: saved.completed
        })
      })
    } : session);
  }

  private queueSetUpdate(update: PendingSetUpdate): void {
    this.pendingSetUpdates.update((updates) => [...updates.filter((item) => item.setId !== update.setId), update]);
    this.persistCache();
  }

  private cacheKey(): string | null {
    const userId = this.authUserId();
    return userId ? `${CACHE_PREFIX}${userId}` : null;
  }

  private hydrateCache(): boolean {
    const key = this.cacheKey();
    if (!key || typeof localStorage === 'undefined') return false;
    try {
      const cache = JSON.parse(localStorage.getItem(key) ?? 'null') as Partial<CacheSnapshot> | null;
      if (!cache) return false;
      if (Array.isArray(cache.exercises)) this.exercises.set(cache.exercises);
      if (Array.isArray(cache.routines)) this.routines.set(cache.routines);
      if (Array.isArray(cache.sessions)) this.sessions.set(cache.sessions);
      if (cache.activeSession !== undefined) this.activeSession.set(cache.activeSession ?? null);
      if (Array.isArray(cache.pendingSetUpdates)) this.pendingSetUpdates.set(cache.pendingSetUpdates);
      return true;
    } catch {
      return false;
    }
  }

  private clearCache(key: string | null): void {
    if (!key || typeof localStorage === 'undefined') return;
    try { localStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }

  private persistCache(): void {
    const key = this.cacheKey();
    if (!key || typeof localStorage === 'undefined') return;
    const cache: CacheSnapshot = {
      exercises: this.exercises(),
      routines: this.routines(),
      sessions: this.sessions(),
      activeSession: this.activeSession(),
      pendingSetUpdates: this.pendingSetUpdates()
    };
    try { localStorage.setItem(key, JSON.stringify(cache)); } catch { /* Storage may be unavailable or full. */ }
  }

  private authRedirect(path: string): string {
    return typeof document === 'undefined' ? path : new URL(path, document.baseURI).toString();
  }

  exerciseById(id: string): Exercise | undefined {
    return this.exerciseMap().get(id);
  }

  routineById(id: string): Routine | undefined {
    return this.routines().find((routine) => routine.id === id);
  }

  async startWorkout(routineId: string, routineDayId?: string): Promise<WorkoutSession | null> {
    const routine = this.routineById(routineId);
    if (!routine || routine.archivedAt) return null;

    const day = routine.routineDays?.find((item) => item.id === routineDayId) ?? routine.routineDays?.[0];
    if (!day?.id) {
      this.remoteError.set('Esta rutina no tiene ningún día configurado.');
      return null;
    }

    const client = getSupabase();
    if (!client || !this.isAuthenticated()) {
      this.remoteError.set('No hay una sesión de Supabase activa.');
      return null;
    }

    this.remoteState.set('loading');
    const { data, error } = await client.rpc('start_workout', {
      p_routine_id: routineId,
      p_routine_day_id: day.id
    });
    if (error) {
      this.fail(error.message);
      return null;
    }
    const session = await this.loadRemoteActiveSession(data as string);
    if (session) this.remoteState.set('ready');
    return session;
  }

  updateSet(
    sessionExerciseId: string,
    setId: string,
    values: { weight?: number | null; reps?: number | null }
  ): void {
    const currentSet = this.findSet(sessionExerciseId, setId);
    if (!currentSet) return;
    this.applyLocalSet(sessionExerciseId, setId, {
      weight: values.weight === undefined ? currentSet.weight : values.weight,
      reps: values.reps === undefined ? currentSet.reps : values.reps,
      completed: currentSet.completed
    });
    this.scheduleSetWrite(sessionExerciseId, setId, SET_WRITE_DEBOUNCE_MS);
  }

  toggleSet(sessionExerciseId: string, setId: string): void {
    const currentSet = this.findSet(sessionExerciseId, setId);
    if (!currentSet) return;
    this.applyLocalSet(sessionExerciseId, setId, {
      weight: currentSet.weight,
      reps: currentSet.reps,
      completed: !currentSet.completed
    });
    this.scheduleSetWrite(sessionExerciseId, setId, 0);
  }

  private findSet(sessionExerciseId: string, setId: string): WorkoutSet | undefined {
    return this.activeSession()?.exercises.find((exercise) => exercise.id === sessionExerciseId)?.sets.find((set) => set.id === setId);
  }

  private applyLocalSet(
    sessionExerciseId: string,
    setId: string,
    values: { weight: number | null; reps: number | null; completed: boolean }
  ): void {
    this.setVersions.set(setId, (this.setVersions.get(setId) ?? 0) + 1);
    this.activeSession.update((current) => current ? {
      ...current,
      exercises: current.exercises.map((exercise) => exercise.id !== sessionExerciseId ? exercise : {
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : { ...set, ...values })
      })
    } : current);
    // Keep queued offline updates in sync so a retry never sends stale values.
    if (this.pendingSetUpdates().some((item) => item.setId === setId)) {
      this.pendingSetUpdates.update((updates) => updates.map((item) => item.setId === setId ? { ...item, ...values } : item));
    }
    this.persistCache();
  }

  private scheduleSetWrite(sessionExerciseId: string, setId: string, delayMs: number): void {
    const scheduled = this.setWriteTimers.get(setId);
    if (scheduled) clearTimeout(scheduled.timer);
    const timer = setTimeout(() => {
      this.setWriteTimers.delete(setId);
      void this.runSetWrite(setId, () => this.writeLocalSet(sessionExerciseId, setId));
    }, delayMs);
    this.setWriteTimers.set(setId, { sessionExerciseId, timer });
  }

  private async flushSetWrites(): Promise<void> {
    const scheduled = [...this.setWriteTimers.entries()];
    this.setWriteTimers.clear();
    scheduled.forEach(([setId, { sessionExerciseId, timer }]) => {
      clearTimeout(timer);
      void this.runSetWrite(setId, () => this.writeLocalSet(sessionExerciseId, setId));
    });
    await Promise.all(this.setWriteQueue.values());
  }

  // Writes for the same set run one after another so the server keeps the last value.
  private runSetWrite(setId: string, task: () => Promise<void>): Promise<void> {
    const next = (this.setWriteQueue.get(setId) ?? Promise.resolve()).then(task).catch(() => undefined);
    this.setWriteQueue.set(setId, next);
    void next.then(() => {
      if (this.setWriteQueue.get(setId) === next) this.setWriteQueue.delete(setId);
    });
    return next;
  }

  private async writeLocalSet(sessionExerciseId: string, setId: string): Promise<void> {
    const session = this.activeSession();
    const currentSet = this.findSet(sessionExerciseId, setId);
    if (!session || !currentSet) return;
    const error = await this.sendSetUpdate({
      sessionId: session.id,
      sessionExerciseId,
      setId,
      weight: currentSet.weight,
      reps: currentSet.reps,
      completed: currentSet.completed
    });
    if (error) this.fail(error, 'workout-set');
  }

  private async sendSetUpdate(update: PendingSetUpdate): Promise<string | null> {
    const client = getSupabase();
    if (!client) return null;
    const version = this.setVersions.get(update.setId) ?? 0;
    const { data, error } = await client.rpc('update_workout_set', {
      p_set_id: update.setId,
      p_weight: update.weight,
      p_reps: update.reps,
      p_completed: update.completed
    });
    const isLatest = (this.setVersions.get(update.setId) ?? 0) === version;
    if (error) {
      if (isLatest) this.queueSetUpdate(update);
      return error.message;
    }
    if (isLatest) {
      this.applySavedSet(update.sessionExerciseId, update.setId, data as RemoteWorkoutSet);
      this.pendingSetUpdates.update((updates) => updates.filter((item) => item.setId !== update.setId));
    }
    this.persistCache();
    return null;
  }

  async addSet(sessionExerciseId: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    this.remoteState.set('loading');
    const { data, error } = await client.rpc('add_workout_set', { p_session_exercise_id: sessionExerciseId });
    if (error) {
      this.fail(error.message);
      return;
    }
    const saved = data as RemoteWorkoutSet;
    this.activeSession.update((session) => session ? {
      ...session,
      exercises: session.exercises.map((exercise) => exercise.id !== sessionExerciseId ? exercise : {
        ...exercise,
        sets: [...exercise.sets, {
          id: saved.id,
          weight: saved.weight,
          reps: saved.reps,
          target: saved.target,
          completed: saved.completed
        }]
      })
    } : session);
    this.persistCache();
    this.remoteState.set('ready');
  }

  async saveWorkout(): Promise<boolean> {
    const session = this.activeSession();
    if (!session) return false;
    await this.flushSetWrites();
    await this.retryPendingWrites();
    const saved = await this.loadRemoteActiveSession(session.id);
    if (saved) this.remoteState.set('ready');
    this.persistCache();
    return saved !== null || this.activeSession() !== null;
  }

  async finishWorkout(): Promise<boolean> {
    const session = this.activeSession();
    const client = getSupabase();
    if (!session || !client) return false;
    await this.flushSetWrites();
    await this.retryPendingWrites();
    if (this.pendingSetUpdates().length) {
      this.fail('Hay cambios pendientes de sincronizar. Recupera la conexión e inténtalo de nuevo.', 'finish-workout');
      return false;
    }

    this.remoteState.set('loading');
    const { error } = await client.rpc('finish_workout', { p_session_id: session.id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.activeSession.set(null);
    this.pendingSetUpdates.set([]);
    await this.loadRemoteHistory();
    this.persistCache();
    this.remoteState.set('ready');
    return true;
  }

  async createRoutineProgram(input: RoutineDraft): Promise<boolean> {
    const client = getSupabase();
    this.remoteState.set('loading');
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('create_routine_program', this.routinePayload(input));
    if (error) {
      this.fail(error.message);
      return false;
    }
    await this.loadRemoteRoutines();
    this.remoteState.set('ready');
    return true;
  }

  async updateRoutineProgram(id: string, input: RoutineDraft): Promise<boolean> {
    const client = getSupabase();
    this.remoteState.set('loading');
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('update_routine_program', {
      p_routine_id: id,
      ...this.routinePayload(input)
    });
    if (error) {
      this.fail(error.message);
      return false;
    }
    await this.loadRemoteRoutines();
    this.remoteState.set('ready');
    return true;
  }

  private routinePayload(input: RoutineDraft): Record<string, unknown> {
    return {
      p_name: input.name,
      p_focus: input.focus,
      p_duration: input.duration,
      p_color: input.color,
      p_days: input.routineDays.map((day) => ({
        id: day.id ?? null,
        name: day.name,
        exercises: day.exercises.map((exercise) => ({
          exercise_id: exercise.exerciseId,
          sets: exercise.sets,
          rep_range: exercise.repRange,
          rest_seconds: exercise.restSeconds,
          note: exercise.note ?? null
        }))
      }))
    };
  }

  async archiveRoutine(id: string): Promise<boolean> {
    const client = getSupabase();
    this.remoteState.set('loading');
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('archive_routine', { p_routine_id: id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.routines.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt: new Date().toISOString() } : routine));
    this.persistCache();
    this.remoteState.set('ready');
    return true;
  }

  async unarchiveRoutine(id: string): Promise<boolean> {
    const client = getSupabase();
    this.remoteState.set('loading');
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('unarchive_routine', { p_routine_id: id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.routines.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt: null } : routine));
    this.persistCache();
    this.remoteState.set('ready');
    return true;
  }

  async addExercise(name: string, muscle: string, equipment: string, kind: ExerciseKind = 'strength'): Promise<boolean> {
    const client = getSupabase();
    this.remoteState.set('loading');
    if (!client) {
      this.fail('Supabase no está configurado.');
      return false;
    }
    const { data: user } = await client.auth.getUser();
    if (!user.user) {
      this.fail('Inicia sesión para crear ejercicios.');
      return false;
    }
    const initials = name.split(/\s+/).filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    const { error } = await client.from('exercises').insert({
      owner_id: user.user.id,
      name,
      muscle: muscle || 'General',
      secondary: '',
      equipment: equipment || 'Libre',
      kind,
      initials,
      color: '#d8f36a'
    });
    if (error) {
      this.fail(error.message);
      return false;
    }
    await this.loadRemoteExercises();
    if (this.remoteState() !== 'error') this.remoteState.set('ready');
    return true;
  }

  private fail(message: string, source = 'remote'): false {
    this.remoteState.set('error');
    this.remoteError.set(message);
    void this.logClientError(message, source);
    return false;
  }
}
