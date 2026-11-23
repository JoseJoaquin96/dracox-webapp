import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../core/auth/auth.store';
import { AppError } from '../core/errors';
import { SyncStatus } from '../core/sync-status';
import { ExerciseApi } from '../data/exercise.api';
import { Exercise, ExerciseDraft } from '../domain/models';

@Injectable({ providedIn: 'root' })
export class ExerciseStore {
  private readonly api = inject(ExerciseApi);
  private readonly auth = inject(AuthStore);
  private readonly status = inject(SyncStatus);
  private readonly state = signal<Exercise[]>([]);
  private readonly index = computed(() => new Map(this.state().map((exercise) => [exercise.id, exercise])));
  readonly all = this.state.asReadonly();
  readonly muscles = computed(() => [...new Set(this.state().map((exercise) => exercise.muscle))].sort((a, b) => a.localeCompare(b, 'es')));

  byId(id: string): Exercise | undefined {
    return this.index().get(id);
  }

  restore(exercises: Exercise[]): void {
    this.state.set(exercises);
  }

  load(): Promise<boolean> {
    return this.status.run(() => this.reload(this.auth.userId()));
  }

  create(draft: ExerciseDraft): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      if (!userId) throw new AppError('Inicia sesión para crear ejercicios.');
      await this.api.create(userId, draft);
      await this.reload(userId);
    });
  }

  update(id: string, draft: ExerciseDraft): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      await this.api.update(id, draft);
      await this.reload(userId);
    });
  }

  remove(id: string): Promise<boolean> {
    return this.status.run(async () => {
      const userId = this.auth.userId();
      await this.api.remove(id);
      if (this.auth.userId() !== userId) return;
      this.state.update((exercises) => exercises.filter((exercise) => exercise.id !== id));
    });
  }

  isOwn(exercise: Exercise): boolean {
    return exercise.ownerId !== null && exercise.ownerId === this.auth.userId();
  }

  private async reload(userId: string | null): Promise<void> {
    if (!userId || this.auth.userId() !== userId) return;
    const exercises = await this.api.list(userId);
    if (this.auth.userId() === userId) this.state.set(exercises);
  }
}
