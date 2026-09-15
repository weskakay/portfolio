/**
 * CSS zoom of the root element, above 1 only on very wide screens.
 * Rects and pointer positions come back zoomed, CSS lengths do not, so code
 * that mixes the two divides or multiplies by this.
 */
export function pageZoom(): number {
  return parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
}
