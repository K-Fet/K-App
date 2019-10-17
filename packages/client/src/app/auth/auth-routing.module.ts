import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CancelEmailUpdateComponent } from './cancel-email-update/cancel-email-update.component';
import { DefinePasswordComponent } from './define-password/define-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cancel-email-update',
    component: CancelEmailUpdateComponent,
  },
  {
    path: 'define-password',
    component: DefinePasswordComponent,
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
  },
  {
    path: '',
    redirectTo: '/auth/login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
