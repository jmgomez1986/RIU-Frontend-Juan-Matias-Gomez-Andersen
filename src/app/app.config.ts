import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { getSpanishPaginatorIntl } from './shared/i18n/spanish-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideSweetAlert2({
      // Optional configuration
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    // Paginador de Angular Material en español
    { provide: MatPaginatorIntl, useFactory: getSpanishPaginatorIntl },
  ],
};
