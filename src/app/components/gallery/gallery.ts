import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { GALLERY } from '../../data/gallery';
import { GalleryLightbox } from './gallery-lightbox/gallery-lightbox';

/** How many dots stand fully visible on each side of the active one. */
const DOT_REACH = 2;
/** One more dot on each side than visible, so a dot can slide in and out. */
const DOT_OFFSETS = Array.from({ length: 2 * DOT_REACH + 3 }, (_, i) => i - DOT_REACH - 1);
/** Keys that move the row, with the direction they move it in. */
const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
/** Photo in the middle when the page loads: the portrait in the white shirt. */
const START_PHOTO = 1;
/** Quiet time after the last scroll event before the row counts as settled. */
const SETTLE_MS = 150;

/** One dot of the sliding dot band. */
interface GalleryDot {
  /** Place in the tripled row, keeps the dot element while it slides. */
  position: number;
  /** Photo the dot stands for. */
  photo: number;
  /** Steps away from the active dot, negative to the left. */
  offset: number;
  /** Outermost dots wait invisible at the ends of the band. */
  hidden: boolean;
}

/**
 * Sport gallery as an endless carousel. The row holds the photos three times,
 * the visitor starts in the middle copy. Arrows, dots and arrow keys glide one
 * photo at a time; past the first or last photo the row glides on into the
 * copy next to it and then quietly jumps back to the same photo in the middle
 * copy. The dots are a band that slides along with the active photo. A click
 * on a photo opens it large. The page scrolls past the section as usual.
 */
@Component({
  selector: 'app-gallery',
  imports: [GalleryLightbox],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements AfterViewInit, OnDestroy {
  protected readonly lang = inject(LanguageService);
  protected readonly shots = GALLERY;
  protected readonly row = [...GALLERY, ...GALLERY, ...GALLERY];
  /** Index of the centred tile in the tripled row. */
  protected readonly position = signal(GALLERY.length + START_PHOTO);
  protected readonly active = computed(() => this.position() % this.shots.length);
  protected readonly isOpen = signal(false);
  protected readonly dots = computed<GalleryDot[]>(() =>
    DOT_OFFSETS.map((offset) => {
      const position = this.position() + offset;
      return { position, photo: this.wrap(position), offset, hidden: Math.abs(offset) > DOT_REACH };
    }),
  );

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly tiles = viewChildren<ElementRef<HTMLElement>>('tile');
  private observer?: ResizeObserver;
  private settleTimer?: ReturnType<typeof setTimeout>;
  /**
   * True while the visitor moves the row by hand. Only then does a scroll change
   * the active photo; the browser snapping the row on a layout change does not.
   */
  private byHand = false;

  /**
   * Centre the start photo, and centre the active one again whenever the row or
   * its photos change size, e.g. once the photo heights settle on a phone.
   */
  ngAfterViewInit(): void {
    const viewport = this.viewport().nativeElement;
    this.observer = new ResizeObserver(() => this.scrollToTile(this.position(), 'auto'));
    this.observer.observe(viewport);
    this.observer.observe(viewport.firstElementChild!);
  }

  /** Stop watching the row and drop a pending settle when the view goes. */
  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.settleTimer);
  }

  /**
   * Glide a number of photos to the left or right. The row first jumps, without
   * any visible change, to the same photo in the middle copy, so there is always
   * a copy to glide into.
   */
  protected moveBy(steps: number): void {
    const home = this.shots.length + this.active();
    if (home !== this.position()) this.scrollToTile(home, 'auto');
    this.scrollToTile(home + steps, this.isOpen() ? 'auto' : this.behavior());
  }

  /** A swipe or trackpad gesture makes the photo in the middle the active one. */
  protected onScroll(): void {
    if (this.isOpen()) return;
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.settle(), SETTLE_MS);
    if (this.byHand) this.position.set(this.closestTile());
  }

  /** The visitor takes over the row with a finger, the mouse or the trackpad. */
  protected takeOver(): void {
    this.byHand = true;
  }

  /** Arrow keys move one photo while the row has focus. */
  protected onKeydown(event: KeyboardEvent): void {
    const step = KEY_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    this.moveBy(step);
  }

  /** Centre the clicked photo and show it large. */
  protected open(tile: number): void {
    clearTimeout(this.settleTimer);
    this.scrollToTile(tile);
    this.isOpen.set(true);
  }

  /**
   * The dialog hands focus back to the photo that opened it, which scrolls the
   * row there. Centre the photo that was on show last in the middle copy and
   * focus it there instead.
   */
  protected onClosed(): void {
    const home = this.shots.length + this.active();
    this.scrollToTile(home, 'auto');
    this.tiles()[home].nativeElement.querySelector('button')?.focus({ preventScroll: true });
    this.isOpen.set(false);
  }

  /** Replace `%1` with the photo number and `%2` with the photo count. */
  protected label(text: string, photo: number): string {
    return text.replace('%1', String(photo + 1)).replace('%2', String(this.shots.length));
  }

  /** Whether a tile belongs to one of the two outer copies of the row. */
  protected isCopy(tile: number): boolean {
    return tile < this.shots.length || tile >= 2 * this.shots.length;
  }

  /** Centre one tile of the tripled row. */
  private scrollToTile(tile: number, behavior = this.behavior()): void {
    const el = this.viewport().nativeElement;
    const left = this.centreOf(tile);
    const settled = Math.abs(left - el.scrollLeft) < 1;
    this.position.set(tile);
    this.byHand = false;
    // an instant scroll also stops a glide that is still on its way elsewhere
    el.scrollTo({ left, behavior: settled ? 'auto' : behavior });
  }

  /**
   * Once the row stands still, centre the active photo again, or the one nearest
   * the middle if the visitor moved the row. A tile in an outer copy is swapped
   * for the same photo in the middle copy, which looks exactly the same.
   */
  private settle(): void {
    if (this.isOpen()) return;
    const tile = this.byHand ? this.closestTile() : this.position();
    this.scrollToTile(this.shots.length + this.wrap(tile), 'auto');
  }

  /** Keep any index inside the photo list. */
  private wrap(index: number): number {
    const count = this.shots.length;
    return ((index % count) + count) % count;
  }

  /** Scroll position that puts the middle of a tile in the middle of the row. */
  private centreOf(tile: number): number {
    const el = this.tiles()[tile].nativeElement;
    return el.offsetLeft + el.offsetWidth / 2 - this.viewport().nativeElement.clientWidth / 2;
  }

  /** Index of the tile that is nearest to the middle of the row. */
  private closestTile(): number {
    const el = this.viewport().nativeElement;
    const middle = el.scrollLeft + el.clientWidth / 2;
    const gaps = this.tiles().map(({ nativeElement: tile }) =>
      Math.abs(tile.offsetLeft + tile.offsetWidth / 2 - middle),
    );
    return gaps.indexOf(Math.min(...gaps));
  }

  /** Glide, unless the visitor asked for less motion. */
  private behavior(): ScrollBehavior {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }
}
