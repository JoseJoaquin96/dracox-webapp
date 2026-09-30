import { ErrorHandler, Injectable, inject } from '@angular/core';
import { WorkoutStore } from './workout.store';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly store = inject(WorkoutStore);

  handleError(error: unknown): void {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    const details = error instanceof Error && error.stack ? { stack: error.stack.slice(0, 4000) } : null;
    void this.store.logClientError(message || 'Error de Angular', 'angular', details);
  }
}
