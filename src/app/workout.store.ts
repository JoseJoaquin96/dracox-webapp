import { Injectable, computed, effect, signal } from '@angular/core';
import { Exercise, Routine, SessionExercise, WorkoutSession } from './models';
import { getSupabase, isSupabaseConfigured } from './supabase.client';

type RemoteRoutineExercise = {
  exercise_id: string;
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

type RemoteState = 'disabled' | 'signed-out' | 'loading' | 'ready' | 'error';

const starterExercises: Exercise[] = [
  { id: 'bench', name: 'Press banca con barra', muscle: 'Pecho', secondary: 'Tríceps · Hombro', equipment: 'Barra', kind: 'strength', initials: 'PB', color: '#f1a65b' },
  { id: 'row', name: 'Remo con barra', muscle: 'Espalda', secondary: 'Bíceps · Core', equipment: 'Barra', kind: 'strength', initials: 'RB', color: '#8c7bff' },
  { id: 'squat', name: 'Sentadilla trasera', muscle: 'Piernas', secondary: 'Glúteo · Core', equipment: 'Barra', kind: 'strength', initials: 'ST', color: '#b5e46c' },
  { id: 'lat-pulldown', name: 'Jalón al pecho', muscle: 'Espalda', secondary: 'Bíceps', equipment: 'Polea', kind: 'strength', initials: 'JC', color: '#72b6ff' },
  { id: 'shoulder-press', name: 'Press militar sentado', muscle: 'Hombros', secondary: 'Tríceps', equipment: 'Mancuernas', kind: 'strength', initials: 'PM', color: '#e98caa' },
  { id: 'leg-press', name: 'Prensa inclinada', muscle: 'Piernas', secondary: 'Glúteo', equipment: 'Máquina', kind: 'strength', initials: 'PI', color: '#9bdcba' },
  { id: 'deadlift', name: 'Peso muerto rumano', muscle: 'Isquios', secondary: 'Glúteo · Espalda', equipment: 'Mancuernas', kind: 'strength', initials: 'PR', color: '#efa06f' },
  { id: 'plank', name: 'Plancha frontal', muscle: 'Core', secondary: 'Abdominales', equipment: 'Peso corporal', kind: 'timed', initials: 'PF', color: '#b4a0f5' }
];

const starterRoutines: Routine[] = [
  {
    id: 'push-a', name: 'Push A', focus: 'Pecho · Hombros · Tríceps', days: 'Lunes', duration: 52, color: '#d8f36a',
    exercises: [
      { exerciseId: 'bench', sets: 4, repRange: '6–8', restSeconds: 120 },
      { exerciseId: 'shoulder-press', sets: 3, repRange: '8–10', restSeconds: 90 },
      { exerciseId: 'leg-press', sets: 3, repRange: '10–12', restSeconds: 90 }
    ]
  },
  {
    id: 'pull-a', name: 'Pull A', focus: 'Espalda · Bíceps', days: 'Miércoles', duration: 48, color: '#a99bff',
    exercises: [
      { exerciseId: 'row', sets: 4, repRange: '6–8', restSeconds: 120 },
      { exerciseId: 'lat-pulldown', sets: 3, repRange: '8–12', restSeconds: 90 },
      { exerciseId: 'deadlift', sets: 3, repRange: '8–10', restSeconds: 120 }
    ]
  },
  {
    id: 'legs-a', name: 'Legs A', focus: 'Cuádriceps · Glúteo · Core', days: 'Viernes', duration: 56, color: '#91d4ba',
    exercises: [
      { exerciseId: 'squat', sets: 4, repRange: '5–8', restSeconds: 150 },
      { exerciseId: 'leg-press', sets: 4, repRange: '10–12', restSeconds: 90 },
      { exerciseId: 'plank', sets: 3, repRange: '45 s', restSeconds: 60 }
    ]
  }
];

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

@Injectable({ providedIn: 'root' })
export class WorkoutStore {
  readonly exercises = signal<Exercise[]>(this.restore('forge-exercises', starterExercises));
  readonly routines = signal<Routine[]>(this.restore('forge-routines', starterRoutines));
  readonly sessions = signal<WorkoutSession[]>(this.restore('forge-sessions', []));
  readonly activeSession = signal<WorkoutSession | null>(this.restoreNullable<WorkoutSession>('forge-active-session'));
  readonly remoteState = signal<RemoteState>(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  readonly remoteError = signal<string | null>(null);
  readonly authEmail = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.authEmail() !== null);

  constructor() {
    effect(() => {
      this.persist('forge-exercises', this.exercises());
      this.persist('forge-routines', this.routines());
      this.persist('forge-sessions', this.sessions());
      this.persist('forge-active-session', this.activeSession());
    });
    void this.refreshFromSupabase();
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) {
      this.remoteState.set('disabled');
      this.remoteError.set('Crea src/assets/supabase-config.json con la configuración de Supabase.');
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
    await this.loadRemoteRoutines();
    return this.remoteState() === 'ready';
  }

  async signOut(): Promise<void> {
    const client = getSupabase();
    if (client) await client.auth.signOut();
    this.authEmail.set(null);
    this.remoteError.set(null);
    this.remoteState.set(isSupabaseConfigured() ? 'signed-out' : 'disabled');
  }

  private async refreshFromSupabase(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client.auth.getSession();
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set(error.message);
      return;
    }

    this.authEmail.set(data.session?.user.email ?? null);
    if (data.session) await this.loadRemoteRoutines();
  }

  private async loadRemoteRoutines(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    this.remoteState.set('loading');
    const { data, error } = await client.rpc('get_my_routines');
    if (error) {
      this.remoteState.set('error');
      this.remoteError.set(error.message);
      return;
    }

    const remoteRoutines = (data ?? []) as RemoteRoutine[];
    const remoteExercises = remoteRoutines
      .flatMap((routine) => routine.exercises ?? [])
      .map((planned) => planned.exercise)
      .filter((exercise): exercise is Exercise => exercise !== null);
    const exerciseMap = new Map(this.exercises().map((exercise) => [exercise.id, exercise]));
    remoteExercises.forEach((exercise) => exerciseMap.set(exercise.id, exercise));
    this.exercises.set([...exerciseMap.values()]);
    this.routines.set(remoteRoutines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      focus: routine.focus,
      days: routine.days,
      duration: routine.duration,
      color: routine.color,
      exercises: (routine.exercises ?? []).map((planned) => ({
        exerciseId: planned.exercise_id,
        sets: planned.sets,
        repRange: planned.rep_range,
        restSeconds: planned.rest_seconds,
        note: planned.note ?? undefined
      }))
    })));
    this.remoteError.set(null);
    this.remoteState.set('ready');
  }

  exerciseById(id: string): Exercise | undefined {
    return this.exercises().find((exercise) => exercise.id === id);
  }

  routineById(id: string): Routine | undefined {
    return this.routines().find((routine) => routine.id === id);
  }

  startWorkout(routineId: string): WorkoutSession | null {
    const routine = this.routineById(routineId);
    if (!routine) return null;

    const current = this.activeSession();
    if (current?.routineId === routineId) return current;

    const session: WorkoutSession = {
      id: createId('session'),
      routineId,
      name: routine.name,
      startedAt: new Date().toISOString(),
      status: 'active',
      exercises: routine.exercises.map((routineExercise, index) => ({
        id: `${routineExercise.exerciseId}-${index}`,
        exerciseId: routineExercise.exerciseId,
        sets: Array.from({ length: routineExercise.sets }, (_, setIndex) => ({
          id: `set-${setIndex + 1}`,
          weight: this.defaultWeight(routineExercise.exerciseId, setIndex),
          reps: null,
          target: routineExercise.repRange,
          completed: false
        }))
      }))
    };
    this.activeSession.set(session);
    return session;
  }

  updateSet(sessionExerciseId: string, setId: string, values: { weight?: number | null; reps?: number | null }): void {
    const session = this.activeSession();
    if (!session) return;
    this.activeSession.set({
      ...session,
      exercises: session.exercises.map((exercise) => exercise.id !== sessionExerciseId ? exercise : ({
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : ({ ...set, ...values }))
      }))
    });
  }

  toggleSet(sessionExerciseId: string, setId: string): void {
    const session = this.activeSession();
    if (!session) return;
    this.activeSession.set({
      ...session,
      exercises: session.exercises.map((exercise) => exercise.id !== sessionExerciseId ? exercise : ({
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : ({
          ...set,
          completed: !set.completed,
          reps: set.reps ?? 8
        }))
      }))
    });
  }

  addSet(sessionExerciseId: string): void {
    const session = this.activeSession();
    if (!session) return;
    this.activeSession.set({
      ...session,
      exercises: session.exercises.map((exercise) => {
        if (exercise.id !== sessionExerciseId) return exercise;
        const previous = exercise.sets.at(-1);
        return {
          ...exercise,
          sets: [...exercise.sets, {
            id: createId('set'),
            weight: previous?.weight ?? null,
            reps: null,
            target: previous?.target ?? '8–10',
            completed: false
          }]
        };
      })
    });
  }

  finishWorkout(): void {
    const session = this.activeSession();
    if (!session) return;
    const finishedAt = new Date();
    const durationMinutes = Math.max(1, Math.round((finishedAt.getTime() - new Date(session.startedAt).getTime()) / 60000));
    const finished = { ...session, status: 'completed' as const, finishedAt: finishedAt.toISOString(), durationMinutes };
    this.sessions.update((sessions) => [finished, ...sessions.filter((item) => item.id !== session.id)]);
    this.activeSession.set(null);
  }

  addRoutine(name: string, focus: string): Routine {
    const routine: Routine = {
      id: createId('routine'), name, focus: focus || 'Nueva rutina', days: 'Sin programar', duration: 45,
      color: '#d8f36a', exercises: [{ exerciseId: 'bench', sets: 3, repRange: '8–10', restSeconds: 90 }]
    };
    this.routines.update((routines) => [...routines, routine]);
    return routine;
  }

  updateRoutine(id: string, changes: Partial<Pick<Routine, 'name' | 'focus' | 'days' | 'duration' | 'color' | 'exercises'>>): void {
    this.routines.update((routines) => routines.map((routine) => routine.id === id ? { ...routine, ...changes } : routine));
  }

  renameRoutine(id: string, name: string): void {
    this.updateRoutine(id, { name });
  }

  deleteRoutine(id: string): void {
    this.routines.update((routines) => routines.filter((routine) => routine.id !== id));
  }

  addExercise(name: string, muscle: string, equipment: string): void {
    const initials = name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    this.exercises.update((exercises) => [...exercises, {
      id: createId('exercise'), name, muscle: muscle || 'General', secondary: '—', equipment: equipment || 'Libre', kind: 'strength', initials, color: '#d8f36a'
    }]);
  }

  private defaultWeight(exerciseId: string, setIndex: number): number | null {
    const lastLoggedSet = this.sessions()
      .filter((session) => session.status === 'completed')
      .flatMap((session) => session.exercises)
      .filter((exercise) => exercise.exerciseId === exerciseId)
      .flatMap((exercise) => exercise.sets)
      .find((set) => set.completed && set.weight !== null);
    if (lastLoggedSet?.weight !== null && lastLoggedSet?.weight !== undefined) return lastLoggedSet.weight;

    const weights: Record<string, number> = { bench: 80, row: 65, squat: 100, 'lat-pulldown': 55, 'shoulder-press': 22, 'leg-press': 160, deadlift: 70 };
    const base = weights[exerciseId];
    return base ? base + (setIndex > 1 ? 0 : 0) : null;
  }

  private restore<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : fallback;
    } catch {
      return fallback;
    }
  }

  private restoreNullable<T>(key: string): T | null {
    return this.restore<T | null>(key, null);
  }

  private persist<T>(key: string, value: T): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
  }
}
