import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

/** "About me" section: a short intro plus three personal highlights. */
@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly lang = inject(LanguageService);
}
