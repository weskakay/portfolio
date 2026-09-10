import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { GALLERY } from '../../data/gallery';

/**
 * Sport gallery: a horizontal row the visitor moves with the arrows, a swipe
 * or a sideways trackpad gesture. The section keeps a normal height, so the
 * page scrolls past it in one go instead of holding on to the scroll for a
 * few thousand pixels.
 */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements AfterViewInit, OnDestroy {
  /** Always the same number of dots, whatever the screen width. */
  private static readonly DOTS = 5;

  protected readonly lang = inject(LanguageService);
  protected readonly shots = GALLERY;
  protected readonly dots = Array.from({ length: Gallery.DOTS }, (_, i) => i);
  protected readonly active = signal(0);

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private observer?: ResizeObserver;

  /** Read the starting position, and read it again whenever the row resizes. */
  ngAfterViewInit(): void {
    this.measure();
    this.observer = new ResizeObserver(() => this.measure());
    this.observer.observe(this.viewport().nativeElement);
  }

  /** Stop watching the row when the view goes. */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** Which fifth of the row is showing. */
  protected measure(): void {
    const el = this.viewport().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    const share = max > 0 ? el.scrollLeft / max : 0;
    this.active.set(Math.round(share * (Gallery.DOTS - 1)));
  }

  /** Move the row one fifth in either direction, the same step the dots take. */
  protected step(direction: number): void {
    const el = this.viewport().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollBy({ left: (direction * max) / (Gallery.DOTS - 1), behavior: this.behavior() });
  }

  /** What a screen reader reads out on a position dot. */
  protected dotLabel(i: number): string {
    return this.lang
      .dict()
      .gallery.goTo.replace('%1', String(i + 1))
      .replace('%2', String(Gallery.DOTS));
  }

  /** Jump to one fifth of the row from its dot. */
  protected goToDot(i: number): void {
    const el = this.viewport().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (i / (Gallery.DOTS - 1)) * max, behavior: this.behavior() });
  }

  /** Glide, unless the visitor asked for less motion. */
  private behavior(): ScrollBehavior {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }
}
