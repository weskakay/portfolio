import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Impressum } from './components/impressum/impressum';
import { Datenschutz } from './components/datenschutz/datenschutz';

/** One page plus the two legal pages, unknown paths fall back to the start. */
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'impressum', component: Impressum },
  { path: 'datenschutz', component: Datenschutz },
  { path: '**', redirectTo: '' },
];
