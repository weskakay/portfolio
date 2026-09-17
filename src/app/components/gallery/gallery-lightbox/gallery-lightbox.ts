import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import type { GalleryShot } from '../../../data/gallery';

/** Keys that move to another photo, with the direction they move in. */
const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Large view of one gallery photo in a native modal dialog. The dialog keeps
 * focus inside, closes on Escape and hands focus back to the photo that opened
 * it; the gallery then moves it on to the photo on show. A click beside the
 * photo closes it too. The page behind does not scroll.
 */
@Component({
  selector: 'app-gallery-lightbox',
  templateUrl: './gallery-lightbox.html',
  styleUrl: './gallery-lightbox.scss',
})
export class GalleryLightbox {
  readonly shots = input.required<readonly GalleryShot[]>();
  readonly index = input.required<number>();
  /** -1 for the previous photo, 1 for the next one. */
  readonly step = output<number>();
  readonly closed = output<void>();

  protected readonly lang = inject(LanguageService);
  protected readonly shot = computed(() => this.shots()[this.index()]);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Open the dialog once it is rendered and lock the page scroll until it goes. */
  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
    document.documentElement.style.overflowY = 'hidden';
    inject(DestroyRef).onDestroy(() => (document.documentElement.style.overflowY = ''));
  }

  /** `3 / 27`, shown under the photo. */
  protected counter(): string {
    return `${this.index() + 1} / ${this.shots().length}`;
  }

  /** Close the dialog; its close event tells the gallery. */
  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** A click on the dialog itself, not on anything inside it, lands beside the photo. */
  protected onClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  /** Arrow keys move one photo, Escape is handled by the dialog. */
  protected onKeydown(event: KeyboardEvent): void {
    const direction = KEY_STEPS[event.key];
    if (!direction) return;
    event.preventDefault();
    this.step.emit(direction);
  }
}
