import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule
  ],
  providers: [],
  declarations: [LoginComponent]
})
export class LoginModule { }
