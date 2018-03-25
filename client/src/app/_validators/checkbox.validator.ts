import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ValidateCheckbox(control: AbstractControl): ValidationErrors | null {
    if (control.value !== true) {
        return { validCheckbox: true };
    }
    return null;
}
