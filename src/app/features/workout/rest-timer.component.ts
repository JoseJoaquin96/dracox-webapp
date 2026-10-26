import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { formatClock } from '../../shared/format';

const DEFAULT_REST_SECONDS = 90;

/** Rest countdown. Tracks an end timestamp so it stays accurate when the tab is throttled. */
@Component({
  selector: 'dracox-rest-timer',
  templateUrl: './rest-timer.component.html'
})
export class RestTimerComponent {
  private readonly now = signal(Date.now());
  private readonly endsAt = signal<number | null>(null);
  private readonly pausedSeconds = signal(0);
  private readonly duration = signal(DEFAULT_REST_SECONDS);

  readonly running = computed(() => this.endsAt() !== null);
  readonly remaining = computed(() => {
    const endsAt = this.endsAt();
    return endsAt === null ? this.pausedSeconds() : Math.max(0, Math.ceil((endsAt - this.now()) / 1000));
  });
  readonly label = computed(() => formatClock(this.remaining()));
  readonly percent = computed(() => Math.min(100, this.remaining() / this.duration() * 100));

  constructor() {
    const timer = setInterval(() => this.tick(), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  start(seconds: number): void {
    if (seconds <= 0) return;
    this.duration.set(seconds);
    this.resume(seconds);
  }

  toggle(): void {
    if (this.running()) {
      this.pausedSeconds.set(this.remaining());
      this.endsAt.set(null);
    } else if (this.remaining() > 0) {
      this.resume(this.remaining());
    } else {
      this.start(this.duration());
    }
  }

  adjust(seconds: number): void {
    const endsAt = this.endsAt();
    if (endsAt === null) this.pausedSeconds.update((value) => Math.max(0, value + seconds));
    else this.endsAt.set(Math.max(Date.now(), endsAt + seconds * 1000));
  }

  private resume(seconds: number): void {
    this.now.set(Date.now());
    this.endsAt.set(Date.now() + seconds * 1000);
  }

  private tick(): void {
    this.now.set(Date.now());
    if (!this.running() || this.remaining() > 0) return;
    this.endsAt.set(null);
    this.pausedSeconds.set(0);
    navigator.vibrate?.([200, 100, 200]);
  }
}
