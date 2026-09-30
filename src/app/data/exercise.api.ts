import { Injectable } from '@angular/core';
import { supabase, unwrap } from '../core/supabase';
import { Exercise, ExerciseDraft } from '../domain/models';

const COLUMNS = 'id, name, muscle, secondary, equipment, kind, initials, color';

@Injectable({ providedIn: 'root' })
export class ExerciseApi {
  async list(): Promise<Exercise[]> {
    return unwrap(await supabase().from('exercises').select(COLUMNS).order('name')) as Exercise[];
  }

  async create(ownerId: string, draft: ExerciseDraft): Promise<void> {
    unwrap(await supabase().from('exercises').insert({
      owner_id: ownerId,
      name: draft.name,
      muscle: draft.muscle || 'General',
      equipment: draft.equipment || 'Libre',
      kind: draft.kind,
      initials: initialsOf(draft.name),
      color: '#d8f36a'
    }));
  }
}

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}
