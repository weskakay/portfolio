import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

/** Privacy policy page (Datenschutzerklärung). */
@Component({
  selector: 'app-datenschutz',
  imports: [RouterLink],
  templateUrl: './datenschutz.html',
  styleUrl: '../legal.scss',
})
export class Datenschutz {
  protected readonly lang = inject(LanguageService);
}
