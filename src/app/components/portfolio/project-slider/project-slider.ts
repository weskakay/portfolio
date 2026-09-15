import {
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../services/language.service';

const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Image slider in the project dialog: one screenshot at a time, moved with the
 * arrows, the dots, a swipe or the arrow keys while it has focus.
 */
@Component({
  selector: 'app-project-slider',
  templateUrl: './project-slider.html',
  styleUrl: './project-slider.scss',
})
export class ProjectSlider {
  readonly images = input.required<string[]>();
  readonly title = input.required<string>();

  protected readonly lang = inject(LanguageService);
  protected readonly active = signal(0);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  /** Slide an arrow or dot scrolls to; the positions passed on the way are ignored. */
  private target: number | null = null;

  /** A new project starts on its first image. */
  private readonly resetOnChange = afterRenderEffect(() => {
    this.images();
    this.active.set(0);
    this.target = null;
    this.track().nativeElement.scrollLeft = 0;
  });

  /** Read the current slide from the scroll position. */
  protected measure(): void {
    const el = this.track().nativeElement;
    const index = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
    if (this.target !== null && index !== this.target) return;
    this.target = null;
    this.active.set(index);
  }

  /** A finished scroll always counts, also a swipe that cut a slide short. */
  protected settle(): void {
    this.target = null;
    this.measure();
  }

  /** Move one image in either direction, wrapping at the ends. */
  protected step(direction: number): void {
    const count = this.images().length;
    this.goTo((this.active() + direction + count) % count);
  }

  /** Show the image at the given position. */
  protected goTo(index: number): void {
    const el = this.track().nativeElement;
    const left = index * el.clientWidth;
    this.active.set(index);
    // Already there: no scroll follows, so nothing would clear the target.
    if (Math.abs(el.scrollLeft - left) < 1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.target = index;
    el.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }

  /** Arrow keys move images here instead of switching the project. */
  protected onKeydown(event: KeyboardEvent): void {
    const direction = KEY_STEPS[event.key];
    if (!direction || this.images().length < 2) return;
    event.preventDefault();
    event.stopPropagation();
    this.step(direction);
  }

  /** Label like "Image 2 of 5", used for alt texts and dots. */
  protected label(index: number): string {
    return this.lang
      .dict()
      .portfolio.imageOf.replace('%1', String(index + 1))
      .replace('%2', String(this.images().length));
  }
}
