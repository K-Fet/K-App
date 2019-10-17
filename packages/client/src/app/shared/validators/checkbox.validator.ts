import { AbstractControl, ValidationErrors } from '@angular/forms';

// tslint:disable-next-line:function-name
export function ValidateCheckbox(control: AbstractControl): ValidationErrors | null {
  if (control.value !== true) {
    return { validCheckbox: true };
  }
  return null;
}
