import { Component, input } from '@angular/core';
import type { SkillCategory } from '../../../data/i18n';

/**
 * Line drawing on a skills sleeve: one isometric wireframe per category.
 * Pure decoration, it plots itself in when its sleeve becomes the active one.
 */
@Component({
  selector: 'app-blueprint-art',
  templateUrl: './blueprint-art.html',
  styleUrl: './blueprint-art.scss',
  host: { '[class.plot]': 'plot()' },
})
export class BlueprintArt {
  readonly category = input.required<SkillCategory>();
  /** Draw the lines in again, set while the sleeve is in front. */
  readonly plot = input(false);
}
