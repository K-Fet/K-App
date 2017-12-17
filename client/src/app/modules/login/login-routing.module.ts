import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '',  component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  providers: [
  ],
  exports: [ RouterModule ]
})
export class LoginRoutingModule {}
