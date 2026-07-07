import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
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

/**
 * First-load intro. A canvas universe (parallax stars, nebulae, meteors) fills
 * the screen; the Cassiopeia "W" twinkles and its line draws while the page
 * loads, then the W flies into the navbar logo and the overlay clears. Stays
 * until the page is loaded (min ~2.7s); skipped when reduced motion is set.
 */
@Component({
  selector: 'app-intro-loader',
  imports: [],
  templateUrl: './intro-loader.html',
  styleUrl: './intro-loader.scss',
})
export class IntroLoader implements AfterViewInit, OnDestroy {
  protected readonly done = signal(this.shouldSkip());

  private readonly w = viewChild<ElementRef<SVGSVGElement>>('w');
  private readonly bg = viewChild<ElementRef<HTMLElement>>('bg');
  private readonly sky = viewChild<ElementRef<HTMLCanvasElement>>('sky');
  private readonly stars = viewChild<ElementRef<SVGGElement>>('stars');
  private readonly line = viewChild<ElementRef<SVGPolylineElement>>('line');

  private ctx?: CanvasRenderingContext2D;
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private elapsed = 0;
  private nextMeteorAt = 1200;
  private revealed = false;
  private lineTween?: gsap.core.Tween;
  private twinkleTween?: gsap.core.Tween;
  private starField: Star[] = [];
  private nebulae: Nebula[] = [];
  private meteors: Meteor[] = [];

  ngAfterViewInit(): void {
    if (this.done()) return;
    document.body.style.overflow = 'hidden';
    this.initCanvas();
    this.startSequence();
  }

  ngOnDestroy(): void {
    this.stopRender();
    this.lineTween?.kill();
    this.twinkleTween?.kill();
    this.resizeObserver?.disconnect();
  }

  /** Skip only when reduced motion is requested. */
  private shouldSkip(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    const el = this.sky()!.nativeElement;
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
    gsap.set(this.line()!.nativeElement, { opacity: 0 });
    this.addStars(gsap.timeline({ onComplete: () => this.startLoading() }));
  }

  /** Twinkle right away; start the line loader a beat later, so stars lead. */
  private startLoading(): void {
    this.startTwinkle();
    gsap.delayedCall(0.5, () => this.startLineLoop());
  }

  /** Draw the full W line first to last star, hold, then restart from front. */
  private startLineLoop(): void {
    const line = this.line()!.nativeElement;
    const len = line.getTotalLength();
    gsap.set(line, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
    const to = { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.5 };
    this.lineTween = gsap.to(line, to);
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
    this.twinkleTween?.kill();
    gsap.set(this.line()!.nativeElement, { opacity: 1, strokeDasharray: 'none', strokeDashoffset: 0 });
    gsap.set(this.starGroups(), { opacity: 1 });
    this.addFlyToLogo(gsap.timeline({ onComplete: () => this.finish() }));
  }

  /** Resolve when the page has finished loading (or already has). */
  private loadPromise(): Promise<void> {
    if (document.readyState === 'complete') return Promise.resolve();
    return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  }

  /** Minimum time the intro stays visible so the sequence completes. */
  private minDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }

  /** Safety cap so the intro never hangs on a stalled load. */
  private maxTimeout(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 8000));
  }

  /** Pop the five stars into view with a slight overshoot. */
  private addStars(tl: gsap.core.Timeline): void {
    tl.from(this.starGroups(), { opacity: 0, scale: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.12 });
  }

  /** Shrink and fly the W onto the navbar logo while the universe clears. */
  private addFlyToLogo(tl: gsap.core.Timeline): void {
    const fly = { ...this.logoTransform(), transformOrigin: '0 0', duration: 0.9, ease: 'power3.inOut' };
    tl.to(this.w()!.nativeElement, fly, '+=0.2');
    tl.to(this.bg()!.nativeElement, { opacity: 0, duration: 0.7 }, '<');
    tl.to(this.sky()!.nativeElement, { opacity: 0, duration: 0.7 }, '<');
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
    document.body.style.overflow = '';
    this.done.set(true);
  }
}
