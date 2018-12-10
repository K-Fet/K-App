import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EqualValidator } from './directives/equal-validator.directive';
import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { MomentModule } from 'ngx-moment';
import { DialogsModule } from './dialogs/dialogs.module';

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
    MomentModule,
    DialogsModule,
    NgxPermissionsModule,
    FlexLayoutModule,
    // TODO Use material date picker
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
})
export class SharedModule {}
