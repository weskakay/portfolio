import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PortraitHover } from '../hero/portrait-hover/portrait-hover';

/** "About me" section: intro, personal highlights and the cursor-reactive portrait. */
@Component({
  selector: 'app-about',
  imports: [PortraitHover],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly lang = inject(LanguageService);
}
