import { AfterViewInit, Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageService } from '../../services/language.service';
import { GALLERY } from '../../data/gallery';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sport gallery: the section pins and the photo row pans sideways while the
 * visitor scrolls, driven by the wheel on desktop and by touch on mobile.
 */
@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements AfterViewInit, OnDestroy {
  /** Scroll distance relative to the pan width, so the row passes faster. */
  private static readonly PAN_FACTOR = 0.55;

  protected readonly lang = inject(LanguageService);
  protected readonly shots = GALLERY;

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private ctx?: gsap.Context;

  /** Starts the marquee once the strip is in the DOM and can be measured. */
  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => this.buildHorizontalScroll());
  }

  /** Stops the animation so it does not keep running after the view is gone. */
  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  /** Pin the section and slide the photo row left across its full overflow width. */
  private buildHorizontalScroll(): void {
    const track = this.track().nativeElement;
    gsap.to(track, this.scrollVars(track));
  }

  /** GSAP config: translate the row by its overflow while pinning the section. */
  private scrollVars(track: HTMLElement): gsap.TweenVars {
    return {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: this.section().nativeElement,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth) * Gallery.PAN_FACTOR,
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    };
  }
}
