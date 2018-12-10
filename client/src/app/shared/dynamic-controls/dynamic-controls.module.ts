import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicOwlDateTimeComponent } from './dynamic-owl-date-time/dynamic-owl-date-time.component';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN, DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  DynamicFormControl,
  DynamicFormControlModel, DynamicFormsCoreModule,
} from '@ng-dynamic-forms/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    DynamicOwlDateTimeComponent,
  ],
  entryComponents: [
    DynamicOwlDateTimeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicFormsCoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [
    DynamicFormsCoreModule,
    DynamicOwlDateTimeComponent,
  ],
  providers: [
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: (model: DynamicFormControlModel): Type<DynamicFormControl> | null => {
        switch (model.type) {
          case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
            return DynamicOwlDateTimeComponent;
        }
      },
    },
  ],
})
export class DynamicControlsModule {}
