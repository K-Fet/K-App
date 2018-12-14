import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeDialogComponent } from './code-dialog/code-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { UpdateSchoolDialogComponent } from './update-school/update-school.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CodeDialogComponent,
    ConfirmationDialogComponent,
    UpdateSchoolDialogComponent,
  ],
  entryComponents: [
    CodeDialogComponent,
    ConfirmationDialogComponent,
    UpdateSchoolDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DialogsModule {}
