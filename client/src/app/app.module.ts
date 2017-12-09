import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

//Annimation
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

//Material import
import {
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule
} from '@angular/material';

//Component
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MediaMatcher } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule, 
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    HttpModule
  ],
  bootstrap: [AppComponent],
  providers: [MediaMatcher]
})
export class AppModule { }
