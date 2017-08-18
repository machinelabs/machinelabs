import './polyfills.ts';
import 'autotrack';
import 'autotrack/lib/plugins/url-change-tracker';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

declare const ga: any;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  if (environment.production) {
    ga('require', 'urlChangeTracker');
    ga('send', 'pageview');
  }
});
