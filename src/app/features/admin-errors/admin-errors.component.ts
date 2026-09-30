import { Component, inject, signal } from '@angular/core';
import { ErrorLogService } from '../../core/error-log.service';
import { SyncStatus } from '../../core/sync-status';
import { formatDateTime } from '../../shared/format';

@Component({
  templateUrl: './admin-errors.component.html'
})
export class AdminErrorsComponent {
  readonly errorLog = inject(ErrorLogService);
  private readonly status = inject(SyncStatus);
  readonly formatDateTime = formatDateTime;
  readonly loading = signal(false);

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    await this.status.run(() => this.errorLog.loadRecent(), 'admin-errors');
    this.loading.set(false);
  }

  formatDetails(details: Record<string, unknown>): string {
    return JSON.stringify(details);
  }
}
