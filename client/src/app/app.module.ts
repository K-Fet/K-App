import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

//Annimation
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

//Menu import
import {MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatButtonModule} from '@angular/material';
import { MenuComponent } from './menu/menu.component';

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
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
