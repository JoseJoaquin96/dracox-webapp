import { Injectable } from '@angular/core';
import { supabase, unwrap } from '../core/supabase';
import { Routine, RoutineDraft } from '../domain/models';

type RoutineExerciseRow = {
  exercise_id: string;
  position: number;
  sets: number;
  rep_range: string;
  rest_seconds: number;
  note: string | null;
};

type RoutineDayRow = { id: string; name: string; position: number; routine_exercises: RoutineExerciseRow[] };

type RoutineRow = {
  id: string;
  name: string;
  focus: string;
  days: string;
  duration: number;
  color: string;
  archived_at: string | null;
  routine_days: RoutineDayRow[];
};

const COLUMNS = `
  id, name, focus, days, duration, color, archived_at,
  routine_days(id, name, position, routine_exercises(exercise_id, position, sets, rep_range, rest_seconds, note))
`;

@Injectable({ providedIn: 'root' })
export class RoutineApi {
  async list(): Promise<Routine[]> {
    const rows = unwrap(await supabase().from('routines').select(COLUMNS).order('created_at')) as RoutineRow[];
    return rows.map(toRoutine);
  }

  async create(draft: RoutineDraft): Promise<void> {
    unwrap(await supabase().rpc('create_routine_program', toParams(draft)));
  }

  async update(id: string, draft: RoutineDraft): Promise<void> {
    unwrap(await supabase().rpc('update_routine_program', { p_routine_id: id, ...toParams(draft) }));
  }

  async setArchived(id: string, archived: boolean): Promise<void> {
    unwrap(await supabase().rpc(archived ? 'archive_routine' : 'unarchive_routine', { p_routine_id: id }));
  }
}

const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position;

function toRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    focus: row.focus,
    daysLabel: row.days,
    duration: row.duration,
    color: row.color,
    archivedAt: row.archived_at,
    days: [...row.routine_days].sort(byPosition).map((day) => ({
      id: day.id,
      name: day.name,
      exercises: [...day.routine_exercises].sort(byPosition).map((exercise) => ({
        exerciseId: exercise.exercise_id,
        sets: exercise.sets,
        repRange: exercise.rep_range,
        restSeconds: exercise.rest_seconds,
        note: exercise.note ?? undefined
      }))
    }))
  };
}

function toParams(draft: RoutineDraft) {
  return {
    p_name: draft.name,
    p_focus: draft.focus,
    p_duration: draft.duration,
    p_color: draft.color,
    p_days: draft.days.map((day) => ({
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
