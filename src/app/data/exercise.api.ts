import { Injectable } from '@angular/core';
import { AppError } from '../core/errors';
import { supabase, unwrap } from '../core/supabase';
import { Exercise, ExerciseDraft } from '../domain/models';

type ExerciseRow = Omit<Exercise, 'ownerId'> & { owner_id: string | null };

const COLUMNS = 'id, owner_id, name, muscle, secondary, equipment, kind, initials, color';

@Injectable({ providedIn: 'root' })
export class ExerciseApi {
  async list(): Promise<Exercise[]> {
    const rows = unwrap(await supabase().from('exercises').select(COLUMNS).order('name')) as ExerciseRow[];
    return rows.map(({ owner_id, ...exercise }) => ({ ...exercise, ownerId: owner_id }));
  }

  async create(ownerId: string, draft: ExerciseDraft): Promise<void> {
    unwrap(await supabase().from('exercises').insert({ owner_id: ownerId, color: '#d8f36a', ...toColumns(draft) }));
  }

  async update(id: string, draft: ExerciseDraft): Promise<void> {
    unwrap(await supabase().from('exercises').update(toColumns(draft)).eq('id', id));
  }

  async remove(id: string): Promise<void> {
    const deleted = unwrap(await supabase().from('exercises').delete().eq('id', id).select('id')) as unknown[];
    // RLS silently skips exercises already used in routines or workouts.
    if (!deleted.length) throw new AppError('No se puede borrar: el ejercicio se usa en rutinas o entrenamientos.');
  }
}

function toColumns(draft: ExerciseDraft) {
  return {
    name: draft.name,
    muscle: draft.muscle || 'General',
    equipment: draft.equipment || 'Libre',
    kind: draft.kind,
    initials: initialsOf(draft.name)
  };
}

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}
