import { Injectable } from '@angular/core';
import { supabase, unwrap } from '../core/supabase';
import { PendingSetUpdate, WorkoutSession, WorkoutSet } from '../domain/models';

type SetRow = { id: string; weight: number | null; reps: number | null; target: string; completed: boolean };

type SessionExerciseRow = { id: string; exercise_id: string; note: string | null; sets: SetRow[] | null };

// History and active-session RPCs return slightly different keys for the same session.
type SessionRow = {
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
  status?: WorkoutSession['status'];
  exercises: SessionExerciseRow[] | null;
};

@Injectable({ providedIn: 'root' })
export class WorkoutApi {
  /** Completed sessions started before `before` (or the latest ones), newest first. */
  async history(limit: number, before: string | null = null): Promise<WorkoutSession[]> {
    const rows = unwrap(await supabase().rpc('get_my_workout_history', { p_limit: limit, p_before: before })) as SessionRow[] | null;
    return (rows ?? []).map(toSession);
  }

  async active(sessionId: string | null = null): Promise<WorkoutSession | null> {
    const row = unwrap(await supabase().rpc('get_my_active_workout', { p_session_id: sessionId })) as SessionRow | null;
    return row ? toSession(row) : null;
  }

  /** Returns the id of the new (or already active) session. */
  async start(routineId: string, routineDayId: string): Promise<string> {
    return unwrap(await supabase().rpc('start_workout', { p_routine_id: routineId, p_routine_day_id: routineDayId })) as string;
  }

  async addSet(sessionExerciseId: string): Promise<WorkoutSet> {
    return toSet(unwrap(await supabase().rpc('add_workout_set', { p_session_exercise_id: sessionExerciseId })) as SetRow);
  }

  async updateSet(update: PendingSetUpdate): Promise<WorkoutSet> {
    return toSet(unwrap(await supabase().rpc('update_workout_set', {
      p_set_id: update.setId,
      p_weight: update.weight,
      p_reps: update.reps,
      p_completed: update.completed
    })) as SetRow);
  }

  async finish(sessionId: string): Promise<void> {
    unwrap(await supabase().rpc('finish_workout', { p_session_id: sessionId }));
  }
}

function toSet(row: SetRow): WorkoutSet {
  return { id: row.id, weight: row.weight, reps: row.reps, target: row.target, completed: row.completed };
}

function toSession(row: SessionRow): WorkoutSession {
  return {
    id: row.id ?? row.session_id ?? '',
    routineId: row.routine_id,
    routineDayId: row.routine_day_id ?? undefined,
    dayName: row.day_name ?? undefined,
    name: row.routine_name ?? row.name ?? 'Entrenamiento',
    startedAt: row.started_at,
    finishedAt: row.finished_at ?? undefined,
    durationMinutes: row.duration_minutes ?? undefined,
    status: row.status ?? (row.finished_at ? 'completed' : 'active'),
    exercises: (row.exercises ?? []).map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exercise_id,
      note: exercise.note ?? undefined,
      sets: (exercise.sets ?? []).map(toSet)
    }))
  };
}
