import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Portfolio } from '../portfolio/portfolio';
import { Gallery } from '../gallery/gallery';
import { Contact } from '../contact/contact';

/** Landing page that stacks the one-pager sections. */
@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Portfolio, Gallery, Contact],
  templateUrl: './home.html',
})
export class Home {}
