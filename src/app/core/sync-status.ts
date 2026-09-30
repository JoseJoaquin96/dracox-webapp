import { Injectable, computed, inject, signal } from '@angular/core';
import { AppError, errorMessage, toUserMessage } from './errors';
import { ErrorLogService } from './error-log.service';

/** Global loading/error state shown in the app banner. */
@Injectable({ providedIn: 'root' })
export class SyncStatus {
  private readonly errorLog = inject(ErrorLogService);
  private readonly running = signal(0);
  private readonly lastError = signal<string | null>(null);
  readonly loading = computed(() => this.running() > 0);
  readonly error = this.lastError.asReadonly();

  /** Runs a remote operation and reports its failure. Resolves to whether it succeeded. */
  async run(task: () => Promise<unknown>, source = 'remote'): Promise<boolean> {
    this.running.update((count) => count + 1);
    try {
      await task();
      return true;
    } catch (error) {
      this.report(error, source);
      return false;
    } finally {
      this.running.update((count) => count - 1);
    }
  }

  report(error: unknown, source = 'remote'): void {
    this.lastError.set(toUserMessage(error));
    if (!(error instanceof AppError)) void this.errorLog.log(errorMessage(error), source);
  }

  clearError(): void {
    this.lastError.set(null);
  }
}
