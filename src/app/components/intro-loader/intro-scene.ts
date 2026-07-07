/** Particle model and pure canvas draw helpers for the intro universe. */

export interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  twSpeed: number;
  twPhase: number;
  spike: number;
  color: string;
}

export interface Nebula {
  x: number;
  y: number;
  r: number;
  color: string;
  alpha: number;
}

export interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  max: number;
}

interface Layer {
  count: number;
  min: number;
  max: number;
  spike: number;
}

const LAYERS: Layer[] = [
  { count: 1100, min: 0.3, max: 0.72, spike: 0 },
  { count: 160, min: 0.8, max: 1.2, spike: 0 },
  { count: 40, min: 1.0, max: 1.6, spike: 7 },
  { count: 10, min: 1.7, max: 2.7, spike: 14 },
];

const STAR_COLORS = ['#ffffff', '#eaf1ff', '#d7e4ff', '#c6d8ff', '#ffe8cc', '#ffd3a6'];
const NEBULA_COLORS = ['#4d4356', '#5a4d4a', '#3f4a6a', '#6a4a5a', '#514a63', '#5c5348'];

export const SCENE = {
  meteorGap: [1300, 2800] as const,
  maxMeteors: 2,
  dpiCap: 2,
};

/** Random float in [min, max). */
export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Build a full-screen starfield spread evenly across the canvas. */
export function createStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) stars.push(makeStar(w, h, layer));
  }
  return stars;
}

/** One star at a random position, with size, twinkle and tint. */
function makeStar(w: number, h: number, layer: Layer): Star {
  return { x: rand(0, w), y: rand(0, h), color: pickColor(), ...sizeOf(layer), ...twinkleOf() };
}

/** Radius and spike length for a layer. */
function sizeOf(layer: Layer): Pick<Star, 'r' | 'spike'> {
  return { r: rand(layer.min, layer.max), spike: layer.spike };
}

/** Twinkle parameters shared by every star. */
function twinkleOf(): Pick<Star, 'base' | 'twSpeed' | 'twPhase'> {
  return { base: rand(0.5, 1), twSpeed: rand(1, 2.6), twPhase: rand(0, Math.PI * 2) };
}

/** Pick a star tint from the palette. */
function pickColor(): string {
  return STAR_COLORS[Math.floor(rand(0, STAR_COLORS.length))];
}

/** Coloured gas clouds scattered across the whole field. */
export function createNebulae(w: number, h: number): Nebula[] {
  const out: Nebula[] = [];
  for (let i = 0; i < 18; i++) out.push(makeNebula(w, h, i));
  return out;
}

/** One soft nebula blob at a random position, tinted from the palette. */
function makeNebula(w: number, h: number, i: number): Nebula {
  const d = Math.max(w, h);
  return {
    x: rand(0, w),
    y: rand(0, h),
    r: rand(d * 0.16, d * 0.36),
    color: NEBULA_COLORS[i % NEBULA_COLORS.length],
    alpha: rand(0.06, 0.13),
  };
}

/** Spawn a meteor entering near the top, streaking down and to the right. */
export function spawnMeteor(w: number, h: number): Meteor {
  return {
    x: rand(w * 0.1, w * 0.9),
    y: rand(-h * 0.1, h * 0.2),
    vx: rand(200, 340),
    vy: rand(130, 250),
    len: rand(90, 170),
    life: 0,
    max: rand(0.5, 1),
  };
}

/** Clear the whole canvas. */
export function clear(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.clearRect(0, 0, w, h);
}

/** Draw a soft radial nebula cloud. */
export function drawNebula(ctx: CanvasRenderingContext2D, n: Nebula): void {
  const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
  g.addColorStop(0, hexA(n.color, n.alpha));
  g.addColorStop(0.5, hexA(n.color, n.alpha * 0.4));
  g.addColorStop(1, hexA(n.color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
}

/** Draw a star: cheap dot when faint, else glow + core, plus spikes if bright. */
export function drawStar(ctx: CanvasRenderingContext2D, s: Star, t: number): void {
  const a = clamp01(s.base * (0.55 + 0.45 * Math.sin(t * s.twSpeed + s.twPhase)));
  if (s.r < 0.8) {
    dot(ctx, s, a);
    return;
  }
  if (s.spike) {
    brightStar(ctx, s, a);
    return;
  }
  glow(ctx, s.x, s.y, s.r * 2.1, a * 0.45, s.color);
  core(ctx, s.x, s.y, s.r * 0.45, s.color, a);
}

/** A bright star: subtle bloom, tight glow, fine diffraction spikes, sharp core. */
function brightStar(ctx: CanvasRenderingContext2D, s: Star, a: number): void {
  glow(ctx, s.x, s.y, s.r * 4, a * 0.18, s.color);
  glow(ctx, s.x, s.y, s.r * 1.8, a * 0.42, s.color);
  spikes(ctx, s.x, s.y, s.r * s.spike, a * 0.95, s.color);
  core(ctx, s.x, s.y, s.r * 0.55, s.color, a);
}

/** Cheap faint pixel star for the dense background field. */
function dot(ctx: CanvasRenderingContext2D, s: Star, a: number): void {
  ctx.globalAlpha = a * 0.8;
  ctx.fillStyle = s.color;
  ctx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);
  ctx.globalAlpha = 1;
}

/** Bright round star core. */
function core(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number): void {
  ctx.globalAlpha = a;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** Radial glow halo in the given colour. */
function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number, color: string): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexA(color, a));
  g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Four tapered diffraction rays for a bright star. */
function spikes(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, a: number, color: string): void {
  ctx.lineWidth = 0.5;
  ray(ctx, x, y, len, 0, a, color);
  ray(ctx, x, y, -len, 0, a, color);
  ray(ctx, x, y, 0, len, a, color);
  ray(ctx, x, y, 0, -len, a, color);
}

/** One diffraction ray, bright at the star and fading to the tip. */
function ray(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, a: number, color: string): void {
  const g = ctx.createLinearGradient(x, y, x + dx, y + dy);
  g.addColorStop(0, hexA(color, a));
  g.addColorStop(1, hexA(color, 0));
  ctx.strokeStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
}

/** Draw a meteor as a fading gradient streak. */
export function drawMeteor(ctx: CanvasRenderingContext2D, m: Meteor): void {
  const sp = Math.hypot(m.vx, m.vy) || 1;
  const tx = m.x - (m.vx / sp) * m.len;
  const ty = m.y - (m.vy / sp) * m.len;
  const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
  g.addColorStop(0, `rgba(255, 255, 255, ${fade(m)})`);
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.strokeStyle = g;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** Meteor tail opacity, fading in then out across its life. */
function fade(m: Meteor): number {
  return Math.sin((m.life / m.max) * Math.PI) * 0.9;
}

/** Clamp a value into [0, 1]. */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Hex colour plus alpha as an rgba() string. */
function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
