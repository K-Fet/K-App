import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALIDATORS } from '@angular/forms';
import { validateEqual } from './equal.validator';
import { ValidateCheckbox } from './checkbox.validator';
import { ValidateSchool } from './school.validator';

@NgModule({
  declarations: [],
  providers: [
    { provide: NG_VALIDATORS, useValue: validateEqual, multi: true },
    { provide: NG_VALIDATORS, useValue: ValidateCheckbox, multi: true },
    { provide: NG_VALIDATORS, useValue: ValidateSchool, multi: true },
  ],
  imports: [
    CommonModule,
  ],
})
export class ValidatorsModule {}
