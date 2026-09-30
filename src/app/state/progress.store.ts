import { Injectable, inject, signal } from '@angular/core';
import { SyncStatus } from '../core/sync-status';
import { ProgressApi } from '../data/progress.api';
import { ExerciseProgressPoint, ProgressSummary } from '../domain/models';

const EMPTY_SUMMARY: ProgressSummary = { sessions: 0, completedSets: 0, volume: 0, records: [], trainingDays: [], weeklyVolume: [] };

/** Statistics computed by the server over the whole history. */
@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private readonly api = inject(ProgressApi);
  private readonly status = inject(SyncStatus);
  private readonly state = signal<ProgressSummary>(EMPTY_SUMMARY);
  private readonly exerciseState = signal<ExerciseProgressPoint[]>([]);
  readonly summary = this.state.asReadonly();
  readonly selectedExerciseId = signal<string | null>(null);
  readonly exerciseProgress = this.exerciseState.asReadonly();

  restore(summary: ProgressSummary | undefined): void {
    this.state.set(summary ?? EMPTY_SUMMARY);
    this.selectedExerciseId.set(null);
    this.exerciseState.set([]);
  }

  load(): Promise<boolean> {
    return this.status.run(async () => this.state.set(await this.api.summary()));
  }

  selectExercise(exerciseId: string | null): Promise<boolean> {
    this.selectedExerciseId.set(exerciseId);
    this.exerciseState.set([]);
    if (!exerciseId) return Promise.resolve(true);
    return this.status.run(async () => {
      const points = await this.api.exerciseProgress(exerciseId);
      if (this.selectedExerciseId() === exerciseId) this.exerciseState.set(points);
    });
  }
}
