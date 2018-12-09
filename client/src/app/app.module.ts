import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { NavMenuComponent } from './layout/nav-menu/nav-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomePageComponent } from './home-page/home-page.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// Load moment french locale
import 'moment/locale/fr';
import * as moment from 'moment';

moment.locale('fr');

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoaderComponent,
    NavMenuComponent,
    NotFoundComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    CoreModule,
    SharedModule,
    NgxPermissionsModule.forRoot(),
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
