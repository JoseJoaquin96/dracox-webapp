import { Component, ElementRef, afterNextRender, inject, input, output } from '@angular/core';

@Component({
  selector: 'dracox-modal',
  host: { '(document:keydown.escape)': 'closed.emit()' },
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

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => host.nativeElement.querySelector<HTMLElement>('input, select, textarea')?.focus());
  }
}
