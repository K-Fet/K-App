import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeDialogComponent } from './code-dialog/code-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { RegisterMemberDialogComponent } from './register-member/register-member-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CodeDialogComponent,
    ConfirmationDialogComponent,
    RegisterMemberDialogComponent,
  ],
  entryComponents: [
    CodeDialogComponent,
    ConfirmationDialogComponent,
    RegisterMemberDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DialogsModule {}
