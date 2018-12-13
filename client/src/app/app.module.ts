import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DateFnsModule, DateFnsConfigurationService } from 'ngx-date-fns';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { NavMenuComponent } from './layout/nav-menu/nav-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// Load date-fns french locale
// @ts-ignore
import * as frLocale from 'date-fns/locale/fr/index.js';

const frenchConfig = new DateFnsConfigurationService();
frenchConfig.setLocale(frLocale);

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoaderComponent,
    NavMenuComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    NgxPermissionsModule.forRoot(),
    DateFnsModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: DateFnsConfigurationService, useValue: frenchConfig }, // <-- All pipes in French by default
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
