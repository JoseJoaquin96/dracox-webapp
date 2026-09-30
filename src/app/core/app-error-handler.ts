import { ErrorHandler, Injectable, inject } from '@angular/core';
import { errorMessage } from './errors';
import { ErrorLogService } from './error-log.service';

/** Sends uncaught errors (Angular and, via global listeners, the window) to the error log. */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly errorLog = inject(ErrorLogService);

  handleError(error: unknown): void {
    console.error(error);
    const details = error instanceof Error && error.stack ? { stack: error.stack.slice(0, 4000) } : null;
    void this.errorLog.log(errorMessage(error) || 'Error desconocido', 'angular', details);
  }
}
