import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFnsModule } from 'ngx-date-fns';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DialogsModule } from './dialogs/dialogs.module';
import { DynamicControlsModule } from './dynamic-controls/dynamic-controls.module';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { ValidatorsModule } from './validators/validators.module';
import { ModalComponent } from './components/modal/modal.component';
import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';

const SHARED_MODULES = [
  CommonModule,
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  DynamicFormsCoreModule,
  DynamicFormsMaterialUIModule,
  ValidatorsModule,
  // Custom Forms Control
  DynamicControlsModule,
  DialogsModule,
  NgxPermissionsModule,
  FlexLayoutModule,
  DateFnsModule,
  // TODO Use material date picker
  //  If needed, import it only in the concerned module
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
];

@NgModule({
  declarations: [
    EditPasswordComponent,
    ModalComponent,
    ConfirmButtonComponent,
  ],
  imports: SHARED_MODULES,
  exports: [
    ...SHARED_MODULES,
    EditPasswordComponent,
    ModalComponent,
    ConfirmButtonComponent,
  ],
})
export class SharedModule {}
