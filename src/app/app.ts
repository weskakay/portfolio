import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Portfolio } from './components/portfolio/portfolio';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Hero, About, Skills, Portfolio],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
