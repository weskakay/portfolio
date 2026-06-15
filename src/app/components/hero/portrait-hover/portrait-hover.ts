import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './portrait-shaders';

/**
 * Portrait with a cursor-following liquid reveal. The football photo is
 * unveiled around the pointer with a watery displacement (WebGL), plus an
 * automatic top-to-bottom wash. Falls back to a static photo without hover.
 */
@Component({
  selector: 'app-portrait-hover',
  imports: [],
  templateUrl: './portrait-hover.html',
  styleUrl: './portrait-hover.scss',
})
export class PortraitHover implements AfterViewInit, OnDestroy {
  readonly business = input.required<string>();
  readonly football = input.required<string>();
  readonly altBusiness = input.required<string>();

  protected readonly ready = signal(false);

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera = new THREE.Camera();
  private material?: THREE.ShaderMaterial;
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private elapsed = 0;
  private hovering = false;
  private autoFade = 1;
  private readonly mouse = new THREE.Vector2(0.5, 0.5);
  private readonly mouseTarget = new THREE.Vector2(0.5, 0.5);

  ngAfterViewInit(): void {
    if (this.canHover()) void this.initWebgl();
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  /** True only on devices with a real hover pointer (desktop). */
  private canHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  }

  /** Load textures, build the scene, wire events and start rendering. */
  private async initWebgl(): Promise<void> {
    const [texA, texB] = await this.loadTextures();
    this.createRenderer();
    this.buildScene(texA, texB);
    this.bindPointer();
    this.observeResize();
    this.resize();
    this.animate();
    this.ready.set(true);
  }

  /** Load both portrait images as textures. */
  private loadTextures(): Promise<[THREE.Texture, THREE.Texture]> {
    const loader = new THREE.TextureLoader();
    const load = (url: string): Promise<THREE.Texture> =>
      new Promise((done) => loader.load(url, (texture) => done(texture)));
    return Promise.all([load(this.business()), load(this.football())]);
  }

  /** Create the transparent WebGL renderer and scene. */
  private createRenderer(): void {
    const canvas = this.canvasRef().nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();
  }

  /** Build the full-quad shader mesh with both textures. */
  private buildScene(texA: THREE.Texture, texB: THREE.Texture): void {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTexA: { value: texA },
        uTexB: { value: texB },
        uMouse: { value: this.mouse },
        uOffsetB: { value: new THREE.Vector2(0, 0) },
        uTint: { value: new THREE.Color(0x70e61c) },
        uHover: { value: 0 },
        uAuto: { value: 0 },
        uRadius: { value: 0.34 },
        uSoft: { value: 0.12 },
        uStrength: { value: 0.05 },
        uTime: { value: 0 },
      },
    });
    this.scene!.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
  }

  /** Attach pointer listeners that drive position and hover intensity. */
  private bindPointer(): void {
    const stage = this.host().nativeElement;
    stage.addEventListener('pointermove', this.onMove);
    stage.addEventListener('pointerenter', this.onEnter);
    stage.addEventListener('pointerleave', this.onLeave);
  }

  private readonly onMove = (event: PointerEvent): void => {
    const rect = this.host().nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.mouseTarget.set(x, 1 - y);
  };

  private readonly onEnter = (): void => {
    this.hovering = true;
    gsap.to(this.material!.uniforms['uHover'], { value: 1, duration: 0.8, ease: 'power2.out' });
  };

  private readonly onLeave = (): void => {
    this.hovering = false;
    gsap.to(this.material!.uniforms['uHover'], { value: 0, duration: 0.8, ease: 'power2.out' });
  };

  /** Keep the canvas sized to its container at a capped pixel ratio. */
  private readonly resize = (): void => {
    const el = this.host().nativeElement;
    this.renderer!.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer!.setSize(el.clientWidth, el.clientHeight, false);
  };

  /** Observe container size changes to keep the canvas crisp. */
  private observeResize(): void {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host().nativeElement);
  }

  /** Render loop: advance the clock, ease the cursor and update the sweep. */
  private readonly animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    this.elapsed += 0.016;
    this.mouse.lerp(this.mouseTarget, 0.12);
    const uniforms = this.material!.uniforms;
    uniforms['uTime'].value = this.elapsed;
    this.autoFade += ((this.hovering ? 0 : 1) - this.autoFade) * 0.25;
    uniforms['uAuto'].value = this.autoProgress(this.elapsed) * this.autoFade;
    this.renderer!.render(this.scene!, this.camera);
  };

  /** Periodic top-to-bottom sweep: rests, then washes 0 to 1 to 0, and repeats. */
  private autoProgress(t: number): number {
    const rest = 3;
    const sweep = 3;
    const phase = t % (rest + sweep);
    if (phase < rest) return 0;
    return Math.sin(((phase - rest) / sweep) * Math.PI) * 1.25;
  }

  /** Stop the loop and release all WebGL and listener resources. */
  private dispose(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    const stage = this.host().nativeElement;
    stage.removeEventListener('pointermove', this.onMove);
    stage.removeEventListener('pointerenter', this.onEnter);
    stage.removeEventListener('pointerleave', this.onLeave);
    this.renderer?.dispose();
    this.material?.dispose();
  }
}
