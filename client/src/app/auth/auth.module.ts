import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';

@NgModule({
  declarations: [
    ResetPasswordDialogComponent,
  ],
  entryComponents: [
    ResetPasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
