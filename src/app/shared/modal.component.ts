import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, output } from '@angular/core';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

@Component({
  selector: 'dracox-modal',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
    '(keydown)': 'keepFocusInside($event)'
  },
  template: `
    <div class="modal-backdrop" (click)="closed.emit()">
      <section class="modal-card" [class]="panelClass()" role="dialog" aria-modal="true" [attr.aria-label]="heading()" (click)="$event.stopPropagation()">
        <div class="modal-heading">
          <div>
            <span class="eyebrow">{{ eyebrow() }}</span>
            <h2>{{ heading() }}</h2>
          </div>
          <button class="ghost-icon" type="button" (click)="closed.emit()" aria-label="Cerrar">x</button>
        </div>
        <ng-content />
      </section>
    </div>
  `
})
export class ModalComponent {
  readonly eyebrow = input('');
  readonly heading = input.required<string>();
  readonly panelClass = input('');
  readonly closed = output<void>();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    afterNextRender(() => this.host.querySelector<HTMLElement>('input, select, textarea')?.focus());
    inject(DestroyRef).onDestroy(() => previouslyFocused?.focus());
  }

  /** Tab / Shift+Tab cycle through the modal instead of leaving it. */
  keepFocusInside(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const focusable = this.host.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) return;
    const target = event.shiftKey ? last : first;
    const edge = event.shiftKey ? first : last;
    if (document.activeElement !== edge) return;
    event.preventDefault();
    target.focus();
  }
}
