import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiServicesModule } from './api-services/api-services.module';
import { ServicesModule } from './services/services.module';
import { AppErrorHandler } from './error.handler';
import { RequestInterceptor } from './request.interceptor';
import { AuthService } from './api-services/auth.service';

// Auth initialization
export function initAuth(authService: AuthService) {
  return () => authService.initializeAuth();
}

// Configure Angular to use French language
// tslint:disable-next-line:no-duplicate-imports
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';

registerLocaleData(fr, 'fr');

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiServicesModule,
    ServicesModule,
  ],
  providers: [
    /*
    * Application Global Configuration
    */
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initAuth, multi: true, deps: [AuthService] },
  ],
})
export class CoreModule {}
