import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { IntroLoader } from './components/intro-loader/intro-loader';

/** Root shell: intro loader, fixed navbar, ambient glow, routed page and footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, IntroLoader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
