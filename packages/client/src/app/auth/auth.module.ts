import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { CancelEmailUpdateComponent } from './cancel-email-update/cancel-email-update.component';
import { DefinePasswordComponent } from './define-password/define-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

@NgModule({
  declarations: [
    ResetPasswordDialogComponent,
    LoginComponent,
    CancelEmailUpdateComponent,
    DefinePasswordComponent,
    EmailVerificationComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
