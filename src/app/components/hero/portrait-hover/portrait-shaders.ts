export const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform vec2 uMouse;
uniform vec2 uOffsetB;
uniform vec3 uTint;
uniform float uHover;
uniform float uAuto;
uniform float uRadius;
uniform float uSoft;
uniform float uStrength;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  float n = noise(vUv * 4.0 + uTime * 0.4);

  // local hover reveal around the lagging cursor, wavy edge
  float dist = distance(vUv, uMouse);
  float r = uRadius + (n - 0.5) * 0.12;
  float hov = smoothstep(r, r - uSoft - 0.1, dist) * uHover;

  // automatic top-to-bottom wash, wavy edge
  float yTop = 1.0 - vUv.y;
  float wipe = 1.0 - smoothstep(uAuto - uSoft, uAuto + uSoft, yTop + (n - 0.5) * 0.25);
  float autoRev = wipe * step(0.001, uAuto);

  float rev = clamp(max(hov, autoRev), 0.0, 1.0);

  // displace only the moving transition edge, not the settled face
  float edge = rev * (1.0 - rev) * 4.0;
  vec2 d = (vec2(noise(vUv * 6.0 + uTime), noise(vUv * 6.0 - uTime)) - 0.5) * uStrength * edge;

  vec4 colorA = texture2D(uTexA, vUv + d * 0.5);
  vec4 colorB = texture2D(uTexB, vUv + uOffsetB + d);
  vec4 color = mix(colorA, colorB, rev);

  // lime shimmer along the transition edge (only on the figure)
  color.rgb = mix(color.rgb, uTint, edge * 0.3 * color.a);

  gl_FragColor = color;
}
`;
