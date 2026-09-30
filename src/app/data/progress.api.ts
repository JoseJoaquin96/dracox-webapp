import { Injectable } from '@angular/core';
import { supabase, unwrap } from '../core/supabase';
import { ExerciseProgressPoint, ProgressSummary } from '../domain/models';

type SummaryRow = {
  sessions: number;
  completed_sets: number;
  volume: number;
  records: { exercise_id: string; weight: number; reps: number; date: string }[];
  training_days: string[];
  weekly_volume: { week_start: string; volume: number }[];
};

type ExerciseProgressRow = { performed_at: string; weight: number; reps: number };

@Injectable({ providedIn: 'root' })
export class ProgressApi {
  async summary(): Promise<ProgressSummary> {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const row = unwrap(await supabase().rpc('get_my_progress_summary', { p_timezone: timeZone })) as SummaryRow;
    return {
      sessions: row.sessions,
      completedSets: row.completed_sets,
      volume: row.volume,
      records: row.records.map((record) => ({ exerciseId: record.exercise_id, weight: record.weight, reps: record.reps, date: record.date })),
      trainingDays: row.training_days,
      weeklyVolume: row.weekly_volume.map((week) => ({ weekStart: week.week_start, volume: week.volume }))
    };
  }

  /** Best set of each of the last sessions with this exercise, oldest first. */
  async exerciseProgress(exerciseId: string): Promise<ExerciseProgressPoint[]> {
    const rows = unwrap(await supabase().rpc('get_my_exercise_progress', { p_exercise_id: exerciseId })) as ExerciseProgressRow[];
    return rows.map((row) => ({ date: row.performed_at, weight: row.weight, reps: row.reps })).reverse();
  }
}
