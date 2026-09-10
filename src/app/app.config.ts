import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/** Height of the fixed navbar, read from the token so both stay in step. */
function navbarHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height');
  return parseFloat(raw) || 0;
}

/** Root providers: fetch based HTTP, the router and anchor scrolling. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // scroll-padding-top does not apply to programmatic scrolls, so anchors
    // would land behind the fixed navbar without this offset
    provideAppInitializer(() => {
      inject(ViewportScroller).setOffset(() => [0, navbarHeight()]);
    }),
  ],
};
