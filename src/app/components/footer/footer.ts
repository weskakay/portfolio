import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

/** Site footer with a short blurb, social links and legal navigation. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly lang = inject(LanguageService);
  protected readonly year = new Date().getFullYear();
}
