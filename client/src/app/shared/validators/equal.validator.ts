import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateEqual(controlName: string, reverse = false): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    // self value
    const v = c.value;

    // control value
    const e = c.root.get(controlName);

    // value not equal
    if (e && v !== e.value && !reverse) return { validateEqual: false };

    // value equal and reverse
    if (e && v === e.value && reverse) {
      delete e.errors['validateEqual'];
      if (!Object.keys(e.errors).length) { e.setErrors(null); }
    }

    // value not equal and reverse
    if (e && v !== e.value && reverse) {
      e.setErrors({ validateEqual: false });
    }

    return null;
  };
}
