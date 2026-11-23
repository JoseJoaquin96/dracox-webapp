import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/auth/auth.store';
import { supabase, unwrap } from '../../core/supabase';
import { SyncStatus } from '../../core/sync-status';
import { ExerciseApi } from '../../data/exercise.api';
import { RoutineApi } from '../../data/routine.api';
import { Exercise, Routine } from '../../domain/models';
import { plannedSets, routineExercises } from '../../domain/stats';
import { RoutineStore } from '../../state/routine.store';
import { RoutineEditorComponent } from '../routines/routine-editor.component';

type ProfileRow = { id: string; display_name: string | null };

interface AdminUser {
  id: string;
  name: string;
}

@Component({
  imports: [FormsModule, RoutineEditorComponent],
  templateUrl: './admin-routines.component.html'
})
export class AdminRoutinesComponent {
  private readonly routineApi = inject(RoutineApi);
  private readonly exerciseApi = inject(ExerciseApi);
  private readonly personalRoutines = inject(RoutineStore);
  private readonly auth = inject(AuthStore);
  private readonly status = inject(SyncStatus);
  private readonly destroyRef = inject(DestroyRef);
  private requestId = 0;
  readonly selection = signal<{ routines: Routine[]; exercises: Exercise[] } | null>(null);
  readonly users = signal<AdminUser[]>([]);
  readonly selectedUserId = signal('');
  readonly showArchived = signal(false);
  readonly loading = signal(false);
  readonly archiving = signal(false);
  readonly editorOpen = signal(false);
  readonly editing = signal<Routine | null>(null);
  readonly plannedSets = plannedSets;
  readonly routineExercises = routineExercises;

  readonly selectedUser = computed(() =>
    this.users().find((user) => user.id === this.selectedUserId()) ?? null
  );
  readonly activeRoutines = computed(() => this.selection()?.routines.filter((routine) => !routine.archivedAt) ?? []);
  readonly archivedRoutines = computed(() => this.selection()?.routines.filter((routine) => routine.archivedAt) ?? []);
  readonly visibleRoutines = computed(() => this.showArchived() ? this.archivedRoutines() : this.activeRoutines());

  constructor() {
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    await this.status.run(async () => {
      const rows = unwrap(await supabase().from('profiles').select('id, display_name').order('display_name')) as ProfileRow[];
      const users = rows.map((row) => ({
        id: row.id,
        name: row.display_name?.trim() || 'Atleta sin nombre'
      }));
      this.users.set(users);
    }, 'admin-routines');
    const firstUser = this.users()[0];
    if (!this.destroyRef.destroyed && !this.selectedUserId() && firstUser) await this.selectUser(firstUser.id);
  }

  async selectUser(userId: string): Promise<void> {
    if (this.editorOpen() || this.archiving()) return;
    this.selectedUserId.set(userId);
    await this.loadSelection();
  }

  async loadSelection(): Promise<void> {
    const userId = this.selectedUserId();
    if (!userId || this.destroyRef.destroyed) return;
    const requestId = ++this.requestId;
    this.selection.set(null);
    this.loading.set(true);
    try {
      const [routines, exercises] = await Promise.all([this.routineApi.list(userId), this.exerciseApi.list(userId)]);
      if (this.isLatestRequest(requestId)) this.selection.set({ routines, exercises });
    } catch (error) {
      if (this.isLatestRequest(requestId)) this.status.report(error, 'admin-routines');
    } finally {
      if (this.isLatestRequest(requestId)) this.loading.set(false);
    }
  }

  openEditor(routine: Routine | null = null): void {
    if (!this.selection() || this.archiving()) return;
    this.editing.set(routine);
    this.editorOpen.set(true);
  }

  async setArchived(routine: Routine, archived: boolean): Promise<void> {
    const user = this.selectedUser();
    if (!user || !this.selection() || this.archiving()) return;
    if (archived && !window.confirm(`¿Archivar la rutina "${routine.name}" de ${user.name}?`)) return;

    this.archiving.set(true);
    const saved = await this.status.run(() => this.routineApi.setArchived(routine.id, archived, user.id), 'admin-routines');
    if (saved) {
      if (user.id === this.auth.userId()) void this.personalRoutines.load();
      void this.loadSelection();
    }
    this.archiving.set(false);
  }

  private isLatestRequest(requestId: number): boolean {
    return this.requestId === requestId && !this.destroyRef.destroyed;
  }
}
