import { Component } from '@angular/core';

let markCount = 0;

/**
 * The W brand mark as inline SVG, so its stars can twinkle from page CSS
 * instead of from a stylesheet inside an image. Purely decorative: the host
 * sets the size and the surrounding link carries the accessible name.
 */
@Component({
  selector: 'app-logo-mark',
  templateUrl: './logo-mark.html',
  styleUrl: './logo-mark.scss',
})
export class LogoMark {
  /** Own gradient id per instance, the page shows the mark twice. */
  protected readonly gradientId = `logo-mark-glow-${++markCount}`;

  /** Fill reference for the five glow circles. */
  protected readonly glowFill = `url(#${this.gradientId})`;
}
