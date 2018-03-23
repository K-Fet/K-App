import { AbstractControl } from '@angular/forms';

export function ValidateCheckbox(control: AbstractControl) {
    if (control.value === true) {
        return { validCheckbox: true };
    }
    return null;
}
