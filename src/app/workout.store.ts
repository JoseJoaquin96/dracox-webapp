import { Injectable, computed, signal } from '@angular/core';
import { Exercise, Routine, RoutineDay, RoutineExercise, SessionExercise, WorkoutSession } from './models';
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

@Injectable({ providedIn: 'root' })
export class WorkoutStore {
  readonly exercises = signal<Exercise[]>([]);
  readonly routines = signal<Routine[]>([]);
  readonly sessions = signal<WorkoutSession[]>([]);
  readonly activeSession = signal<WorkoutSession | null>(null);
  readonly remoteState = signal<RemoteState>(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  readonly remoteError = signal<string | null>(null);
  readonly authEmail = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.authEmail() !== null);
  readonly activeRoutines = computed(() => this.routines().filter((routine) => !routine.archivedAt));
  readonly archivedRoutines = computed(() => this.routines().filter((routine) => Boolean(routine.archivedAt)));

  constructor() {
    void this.refreshFromSupabase();
  }

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

    this.authEmail.set(data.user?.email ?? email);
    await this.loadRemoteData();
    return this.remoteState() === 'ready';
  }

  async signOut(): Promise<void> {
    const client = getSupabase();
    if (client) await client.auth.signOut();
    this.authEmail.set(null);
    this.exercises.set([]);
    this.routines.set([]);
    this.sessions.set([]);
    this.activeSession.set(null);
    this.remoteError.set(null);
    this.remoteState.set(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  }

  private async refreshFromSupabase(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client.auth.getSession();
    if (error) {
      this.fail(error.message);
      return;
    }

    this.authEmail.set(data.session?.user.email ?? null);
    if (data.session) await this.loadRemoteData();
  }

  private async loadRemoteData(): Promise<void> {
    this.remoteState.set('loading');
    await this.loadRemoteExercises();
    await this.loadRemoteRoutines();
    await this.loadRemoteHistory();
    await this.loadRemoteActiveSession();
    if (this.remoteState() !== 'error') this.remoteState.set('ready');
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

  exerciseById(id: string): Exercise | undefined {
    return this.exercises().find((exercise) => exercise.id === id);
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

  async updateSet(
    sessionExerciseId: string,
    setId: string,
    values: { weight?: number | null; reps?: number | null }
  ): Promise<void> {
    const session = this.activeSession();
    const currentSet = session?.exercises.find((exercise) => exercise.id === sessionExerciseId)?.sets.find((set) => set.id === setId);
    const client = getSupabase();
    if (!session || !currentSet || !client) return;

    await this.persistSet(client, sessionExerciseId, setId, {
      weight: values.weight === undefined ? currentSet.weight : values.weight,
      reps: values.reps === undefined ? currentSet.reps : values.reps,
      completed: currentSet.completed
    });
  }

  async toggleSet(sessionExerciseId: string, setId: string): Promise<void> {
    const session = this.activeSession();
    const currentSet = session?.exercises.find((exercise) => exercise.id === sessionExerciseId)?.sets.find((set) => set.id === setId);
    const client = getSupabase();
    if (!session || !currentSet || !client) return;

    await this.persistSet(client, sessionExerciseId, setId, {
      weight: currentSet.weight,
      reps: currentSet.reps,
      completed: !currentSet.completed
    });
  }

  private async persistSet(
    client: NonNullable<ReturnType<typeof getSupabase>>,
    sessionExerciseId: string,
    setId: string,
    values: { weight: number | null; reps: number | null; completed: boolean }
  ): Promise<void> {
    const { data, error } = await client.rpc('update_workout_set', {
      p_set_id: setId,
      p_weight: values.weight,
      p_reps: values.reps,
      p_completed: values.completed
    });
    if (error) {
      this.fail(error.message);
      return;
    }

    const saved = data as RemoteWorkoutSet;
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

  async addSet(sessionExerciseId: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
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
  }

  async saveWorkout(): Promise<boolean> {
    const session = this.activeSession();
    if (!session) return false;
    const saved = await this.loadRemoteActiveSession(session.id);
    if (saved) this.remoteState.set('ready');
    return saved !== null;
  }

  async finishWorkout(): Promise<boolean> {
    const session = this.activeSession();
    const client = getSupabase();
    if (!session || !client) return false;

    const { error } = await client.rpc('finish_workout', { p_session_id: session.id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.activeSession.set(null);
    await this.loadRemoteHistory();
    this.remoteState.set('ready');
    return true;
  }

  async createRoutineProgram(input: RoutineDraft): Promise<boolean> {
    const client = getSupabase();
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
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('archive_routine', { p_routine_id: id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.routines.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt: new Date().toISOString() } : routine));
    this.remoteState.set('ready');
    return true;
  }

  async unarchiveRoutine(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return this.fail('Supabase no está configurado.');
    const { error } = await client.rpc('unarchive_routine', { p_routine_id: id });
    if (error) {
      this.fail(error.message);
      return false;
    }
    this.routines.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, archivedAt: null } : routine));
    this.remoteState.set('ready');
    return true;
  }

  async addExercise(name: string, muscle: string, equipment: string): Promise<void> {
    const client = getSupabase();
    if (!client) {
      this.fail('Supabase no está configurado.');
      return;
    }
    const { data: user } = await client.auth.getUser();
    if (!user.user) {
      this.fail('Inicia sesión para crear ejercicios.');
      return;
    }
    const initials = name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    const { error } = await client.from('exercises').insert({
      owner_id: user.user.id,
      name,
      muscle: muscle || 'General',
      secondary: '',
      equipment: equipment || 'Libre',
      kind: 'strength',
      initials,
      color: '#d8f36a'
    });
    if (error) {
      this.fail(error.message);
      return;
    }
    await this.loadRemoteExercises();
  }

  private fail(message: string): false {
    this.remoteState.set('error');
    this.remoteError.set(message);
    return false;
  }
}
