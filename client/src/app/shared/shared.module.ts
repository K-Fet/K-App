import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFnsModule } from 'ngx-date-fns';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EqualValidator } from './directives/equal-validator.directive';
import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DialogsModule } from './dialogs/dialogs.module';
import { DynamicControlsModule } from './dynamic-controls/dynamic-controls.module';

@NgModule({
  declarations: [
    EqualValidator,
  ],
  exports: [
    CommonModule,
    EqualValidator,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule,
    DynamicFormsMaterialUIModule,
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
  ],
})
export class SharedModule {}
