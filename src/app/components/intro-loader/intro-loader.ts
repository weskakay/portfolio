import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import gsap from 'gsap';
import {
  SCENE,
  clear,
  createNebulae,
  createStars,
  drawMeteor,
  drawNebula,
  drawStar,
  rand,
  spawnMeteor,
} from './intro-scene';
import type { Meteor, Nebula, Star } from './intro-scene';

/** How long one pass of the W takes, and how it accelerates. */
const LINE_DURATION = 0.85;
const LINE_EASE = 'power1.inOut';

/** How much of the whole line the bright head covers. */
const COMET_SHARE = 0.16;

/** Remembers within this tab that the intro already played. */
const SEEN_KEY = 'intro-seen';

/**
 * First-load intro. A canvas universe (parallax stars, nebulae, meteors) fills
 * the screen; the Cassiopeia "W" twinkles and its line draws while the page
 * loads, then the W flies into the navbar logo and the overlay clears. Stays
 * until the page is loaded (min ~1.5s, so the line draws once in full). Runs
 * once per tab; skipped when reduced motion is set.
 */
@Component({
  selector: 'app-intro-loader',
  imports: [],
  templateUrl: './intro-loader.html',
  styleUrl: './intro-loader.scss',
})
export class IntroLoader implements AfterViewInit, OnDestroy {
  protected readonly done = signal(this.shouldSkip());

  private readonly router = inject(Router);
  private readonly scroller = inject(ViewportScroller);

  private readonly w = viewChild<ElementRef<SVGSVGElement>>('w');
  private readonly bg = viewChild<ElementRef<HTMLElement>>('bg');
  private readonly sky = viewChild<ElementRef<HTMLCanvasElement>>('sky');
  private readonly stars = viewChild<ElementRef<SVGGElement>>('stars');
  private readonly line = viewChild<ElementRef<SVGPolylineElement>>('line');
  private readonly comet = viewChild<ElementRef<SVGPolylineElement>>('comet');

  private ctx?: CanvasRenderingContext2D;
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private elapsed = 0;
  private nextMeteorAt = 1200;
  private revealed = false;
  private lineTween?: gsap.core.Tween;
  private cometTween?: gsap.core.Tween;
  private twinkleTween?: gsap.core.Tween;
  private starField: Star[] = [];
  private nebulae: Nebula[] = [];
  private meteors: Meteor[] = [];

  /** Starts the loader once its canvas is on screen. */
  ngAfterViewInit(): void {
    if (this.done()) return;
    document.documentElement.style.overflowY = 'hidden';
    this.initCanvas();
    this.startSequence();
  }

  /** Stops the loop and drops the tweens when the loader leaves. */
  ngOnDestroy(): void {
    this.stopRender();
    this.lineTween?.kill();
    this.cometTween?.kill();
    this.twinkleTween?.kill();
    this.resizeObserver?.disconnect();
  }

  /** Skip on reduced motion, or when the intro already ran in this tab. */
  private shouldSkip(): boolean {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    return this.readSeen();
  }

  /** Session flag, tolerant of browsers that block storage. */
  private readSeen(): boolean {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  /** Remember for this tab that the intro has played. */
  private markSeen(): void {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // storage blocked: the intro simply plays again
    }
  }

  /** Grab the 2D context, size the canvas, build the scene and start the loop. */
  private initCanvas(): void {
    const ctx = this.sky()!.nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.resize();
    this.observeResize();
    this.animate();
  }

  /** Rebuild all particles for the current canvas size. */
  private buildScene(): void {
    const el = this.sky()!.nativeElement;
    this.starField = createStars(el.clientWidth, el.clientHeight);
    this.nebulae = createNebulae(el.clientWidth, el.clientHeight);
  }

  /** Size the drawing buffer to a capped DPR and rebuild the scene. */
  private readonly resize = (): void => {
    const sky = this.sky();
    if (!sky) return;
    const el = sky.nativeElement;
    const dpr = Math.min(window.devicePixelRatio, SCENE.dpiCap);
    el.width = Math.floor(el.clientWidth * dpr);
    el.height = Math.floor(el.clientHeight * dpr);
    this.ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.buildScene();
  };

  /** Keep the canvas matched to its container size. */
  private observeResize(): void {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.sky()!.nativeElement);
  }

  /** Render loop: advance the clock, update meteors and repaint. */
  private readonly animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    this.elapsed += 0.016;
    this.updateMeteors();
    this.render();
  };

  /** Paint the universe: nebulae, planets, drifting stars and meteors. */
  private render(): void {
    const el = this.sky()!.nativeElement;
    const w = el.clientWidth;
    const h = el.clientHeight;
    clear(this.ctx!, w, h);
    this.ctx!.globalCompositeOperation = 'screen';
    for (const n of this.nebulae) drawNebula(this.ctx!, n);
    for (const s of this.starField) drawStar(this.ctx!, s, this.elapsed);
    for (const m of this.meteors) drawMeteor(this.ctx!, m);
    this.ctx!.globalCompositeOperation = 'source-over';
  }

  /** Advance meteors, cull the dead ones and maybe spawn a new one. */
  private updateMeteors(): void {
    for (const m of this.meteors) this.advanceMeteor(m);
    this.meteors = this.meteors.filter((m) => m.life < m.max);
    this.maybeSpawnMeteor();
  }

  /** Move a meteor along its velocity and age it. */
  private advanceMeteor(m: Meteor): void {
    m.x += m.vx * 0.016;
    m.y += m.vy * 0.016;
    m.life += 0.016;
  }

  /** Spawn a meteor when under the cap and the interval has elapsed. */
  private maybeSpawnMeteor(): void {
    const now = this.elapsed * 1000;
    if (this.meteors.length >= SCENE.maxMeteors || now < this.nextMeteorAt) return;
    const el = this.sky()!.nativeElement;
    this.meteors.push(spawnMeteor(el.clientWidth, el.clientHeight));
    this.nextMeteorAt = now + rand(SCENE.meteorGap[0], SCENE.meteorGap[1]);
  }

  /** Start the constellation intro and gate the reveal on real page load. */
  private startSequence(): void {
    this.playIntro();
    const ready = Promise.all([this.loadPromise(), this.minDelay()]);
    void Promise.race([ready, this.maxTimeout()]).then(() => this.revealAndFly());
  }

  /** Show the stars first (line hidden), then start twinkle and the loader. */
  private playIntro(): void {
    gsap.set([this.line()!.nativeElement, this.comet()!.nativeElement], { opacity: 0 });
    this.addStars(gsap.timeline({ onComplete: () => this.startLoading() }));
  }

  /** Twinkle right away; start the line loader a beat later, so stars lead. */
  private startLoading(): void {
    this.startTwinkle();
    gsap.delayedCall(0.1, () => this.startLineLoop());
  }

  /** Draw the full W line first to last star, hold, then restart from front. */
  private startLineLoop(): void {
    const line = this.line()!.nativeElement;
    const len = line.getTotalLength();
    gsap.set(line, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
    const to = {
      strokeDashoffset: 0,
      duration: LINE_DURATION,
      ease: LINE_EASE,
      repeat: -1,
      repeatDelay: 0.3,
    };
    this.lineTween = gsap.to(line, to);
    this.startCometLoop(len);
  }

  /**
   * A short bright piece that rides at the head of the line, in step with it.
   * Without it the drawn end is a flat cut; with it the line arrives at each
   * star the way it left the one before.
   */
  private startCometLoop(len: number): void {
    const comet = this.comet()!.nativeElement;
    const head = len * COMET_SHARE;
    gsap.set(comet, { opacity: 1, strokeDasharray: `${head} ${len}`, strokeDashoffset: head });
    this.cometTween = gsap.to(comet, {
      strokeDashoffset: head - len,
      duration: LINE_DURATION,
      ease: LINE_EASE,
      repeat: -1,
      repeatDelay: 0.3,
    });
  }

  /** Gentle endless twinkle on the five constellation stars. */
  private startTwinkle(): void {
    this.twinkleTween = gsap.to(this.starGroups(), {
      opacity: 0.6,
      duration: 0.9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.15,
    });
  }

  /** Stop the loops and fly the W into the logo once loading is done. */
  private revealAndFly(): void {
    if (this.revealed) return;
    this.revealed = true;
    this.lineTween?.kill();
    this.cometTween?.kill();
    this.twinkleTween?.kill();
    this.settleLine();
    this.addFlyToLogo(gsap.timeline({ onComplete: () => this.finish() }));
  }

  /** Snap the constellation to its finished state before it flies away. */
  private settleLine(): void {
    gsap.set(this.line()!.nativeElement, {
      opacity: 1,
      strokeDasharray: 'none',
      strokeDashoffset: 0,
    });
    gsap.set(this.comet()!.nativeElement, { opacity: 0 });
    gsap.set(this.starGroups(), { opacity: 1 });
  }

  /** Resolve when the page has finished loading (or already has). */
  private loadPromise(): Promise<void> {
    if (document.readyState === 'complete') return Promise.resolve();
    return new Promise((resolve) =>
      window.addEventListener('load', () => resolve(), { once: true }),
    );
  }

  /** Minimum time the intro stays visible so the line draws once in full. */
  private minDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  /** Safety cap so the intro never hangs on a stalled load. */
  private maxTimeout(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 5000));
  }

  /** Pop the five stars into view with a slight overshoot. */
  private addStars(tl: gsap.core.Timeline): void {
    tl.from(this.starGroups(), {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      ease: 'back.out(2)',
      stagger: 0.06,
    });
  }

  /** Shrink and fly the W onto the navbar logo while the universe clears. */
  private addFlyToLogo(tl: gsap.core.Timeline): void {
    const fly = {
      ...this.logoTransform(),
      transformOrigin: '0 0',
      duration: 0.7,
      ease: 'power3.inOut',
    };
    tl.to(this.w()!.nativeElement, fly, '+=0.2');
    tl.to(this.bg()!.nativeElement, { opacity: 0, duration: 0.55 }, '<');
    tl.to(this.sky()!.nativeElement, { opacity: 0, duration: 0.55 }, '<');
    tl.to(this.w()!.nativeElement, { opacity: 0, duration: 0.25 }, '-=0.2');
  }

  /** Box-to-box transform that maps the W exactly onto the navbar logo. */
  private logoTransform(): { x: number; y: number; scale: number } {
    const svg = this.w()!.nativeElement.getBoundingClientRect();
    const logo = document.querySelector('.navbar__logo-w')?.getBoundingClientRect();
    if (!logo) return { x: 0, y: 0, scale: 0.15 };
    return { x: logo.left - svg.left, y: logo.top - svg.top, scale: logo.width / svg.width };
  }

  /** The five star groups (glow plus core) inside the SVG. */
  private starGroups(): NodeListOf<SVGGElement> {
    return this.stars()!.nativeElement.querySelectorAll('.intro__star');
  }

  /** Stop the render loop. */
  private stopRender(): void {
    cancelAnimationFrame(this.frame);
  }

  /** Stop rendering, release scrolling and remove the overlay. */
  private finish(): void {
    this.stopRender();
    this.resizeObserver?.disconnect();
    document.documentElement.style.overflowY = '';
    this.restoreFragment();
    this.markSeen();
    this.done.set(true);
  }

  /** The scroll lock swallowed any deep link, so aim at the fragment again. */
  private restoreFragment(): void {
    const id = this.router.parseUrl(this.router.url).fragment;
    if (id) this.scroller.scrollToAnchor(id);
  }
}
