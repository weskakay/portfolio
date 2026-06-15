import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PortraitHover } from './portrait-hover/portrait-hover';

/**
 * Above-the-fold hero section: intro headline, call to action, social links
 * and the cursor-reactive portrait (see PortraitHover).
 */
@Component({
  selector: 'app-hero',
  imports: [PortraitHover],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly lang = inject(LanguageService);
}
