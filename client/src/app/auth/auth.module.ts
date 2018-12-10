import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ResetPasswordDialogComponent,
  ],
  entryComponents: [
    ResetPasswordDialogComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
