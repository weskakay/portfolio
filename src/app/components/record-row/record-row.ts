import {
  Component,
  ElementRef,
  Injector,
  TemplateRef,
  afterNextRender,
  contentChild,
  inject,
  input,
  linkedSignal,
  model,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { pageZoom } from '../../page-zoom';

/** One sleeve in the row: the title announced for it and the label read out on it. */
export interface RecordItem {
  id: string;
  title: string;
  label: string;
}

/** Pixels a pointer has to travel sideways before it counts as a swipe. */
const SWIPE_DISTANCE = 50;
/** Every this many pixels of a drag flips one more record. */
const DRAG_STEP = 70;
/** Horizontal wheel distance that flips one record. */
const WHEEL_STEP = 80;
/** Delay between two records falling over during one flip. */
const STAGGER_MS = 40;

/**
 * Record row: the items stand side by side like sleeves in a rack. The active
 * one stands upright in a gap, the others lean away from it. Flipping moves the
 * gap and the records in between fall over one after another. The parent draws
 * the cover art with an ng-template that gets the item index.
 */
@Component({
  selector: 'app-record-row',
  imports: [NgTemplateOutlet],
  templateUrl: './record-row.html',
  styleUrl: './record-row.scss',
})
export class RecordRow {
  readonly items = input.required<readonly RecordItem[]>();
  /** Accessible name of the whole row. */
  readonly label = input.required<string>();
  readonly active = model.required<number>();

  protected readonly lang = inject(LanguageService);
  protected readonly cover = contentChild.required(TemplateRef);

  private readonly injector = inject(Injector);
  private readonly cards = viewChildren<ElementRef<HTMLButtonElement>>('card');
  /** Active index before the latest flip, so the stagger knows where it starts. */
  private readonly flipFrom = linkedSignal<number, number>({
    source: this.active,
    computation: (to, previous) => previous?.source ?? to,
  });
  private dragStart: number | null = null;
  private dragged = false;
  private wheelSum = 0;

  /** Flip one record in either direction, wrapping around at the ends. */
  protected step(direction: number): void {
    const count = this.items().length;
    this.active.set((this.active() + direction + count) % count);
  }

  /** -1 left of the gap, 0 the active record, 1 right of it. */
  protected side(index: number): number {
    return Math.sign(index - this.active());
  }

  /** How many records a sleeve stands away from the active one. */
  protected depth(index: number): number {
    return Math.abs(index - this.active());
  }

  /** Records between the old and the new gap fall over one by one. */
  protected delay(index: number): string {
    const from = this.flipFrom();
    const low = Math.min(from, this.active());
    const high = Math.max(from, this.active());
    if (index < low || index > high) return '0ms';
    return `${Math.abs(index - from) * STAGGER_MS}ms`;
  }

  /** Announced whenever the active record changes. */
  protected position(): string {
    return this.lang
      .dict()
      .records.position.replace('%1', String(this.active() + 1))
      .replace('%2', String(this.items().length))
      .replace('%3', this.items()[this.active()].title);
  }

  /** A leaning sleeve gets the gap, unless the click ended a drag. */
  protected onCardClick(index: number): void {
    if (!this.dragged) this.active.set(index);
  }

  /** Arrow keys flip while focus is anywhere inside the row. */
  protected onKeydown(event: KeyboardEvent): void {
    const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!direction) return;
    event.preventDefault();
    const onCard = (event.target as HTMLElement).classList.contains('records__card');
    this.step(direction);
    if (onCard) afterNextRender(() => this.focusActive(), { injector: this.injector });
  }

  /** Sideways scrolling on a trackpad or tilt wheel thumbs through the row. */
  protected onWheel(event: WheelEvent): void {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    this.wheelSum += event.deltaX;
    if (Math.abs(this.wheelSum) < WHEEL_STEP) return;
    this.step(Math.sign(this.wheelSum));
    this.wheelSum = 0;
  }

  /** Remember where a drag started. */
  protected onPointerDown(event: PointerEvent): void {
    this.dragStart = event.clientX;
    this.dragged = false;
  }

  /** A sideways drag flips one record, a longer one several. */
  protected onPointerUp(event: PointerEvent): void {
    if (this.dragStart === null) return;
    const distance = (event.clientX - this.dragStart) / pageZoom();
    this.dragStart = null;
    if (Math.abs(distance) < SWIPE_DISTANCE) return;
    this.dragged = true;
    this.flipBy(-Math.sign(distance) * Math.max(1, Math.round(Math.abs(distance) / DRAG_STEP)));
    setTimeout(() => (this.dragged = false));
  }

  /** Forget a drag the browser took over, e.g. for a vertical scroll. */
  protected onPointerCancel(): void {
    this.dragStart = null;
  }

  /** Keep keyboard focus on the sleeve that just moved into the gap. */
  private focusActive(): void {
    this.cards()[this.active()]?.nativeElement.focus();
  }

  /** Move the gap by several records, wrapping around like the arrows do. */
  private flipBy(steps: number): void {
    const count = this.items().length;
    this.active.set((((this.active() + steps) % count) + count) % count);
  }
}
