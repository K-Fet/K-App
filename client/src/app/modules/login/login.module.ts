import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpClient
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
