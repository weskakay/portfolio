import { AfterViewInit, Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageService } from '../../services/language.service';
import { GALLERY } from '../../data/gallery';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sport gallery: a collage of different-sized photos. On a desktop mouse the
 * section pins and the collage pans horizontally (right to left) while
 * scrolling; touch and reduced-motion get a stacked masonry collage instead.
 */
@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements AfterViewInit, OnDestroy {
  protected readonly lang = inject(LanguageService);
  protected readonly shots = GALLERY;

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (this.usesHorizontalScroll()) this.ctx = gsap.context(() => this.buildHorizontalScroll());
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  /** Pan-on-scroll only for a hovering fine pointer with motion allowed (desktop). */
  private usesHorizontalScroll(): boolean {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    return desktop && motionOk;
  }

  /** Pin the section and slide the collage left across its full overflow width. */
  private buildHorizontalScroll(): void {
    const track = this.track().nativeElement;
    gsap.to(track, this.scrollVars(track));
  }

  /** GSAP config: translate the collage by its overflow while pinning the section. */
  private scrollVars(track: HTMLElement): gsap.TweenVars {
    return {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: this.section().nativeElement,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    };
  }
}
