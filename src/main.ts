import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/modules/app.module';
import { environment } from './environments/environment';

import apiKeys from './app/config/apiKeys.js';

if (environment.production) {
  enableProdMode();
}

// get the google maps library without revealing the api key
document.write(`<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=${apiKeys.places}&libraries=places"></script>`)

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
