import { ValidationErrors } from '@angular/forms';
import { AVAILABLE_SCHOOLS } from '../_models';

// tslint:disable-next-line:function-name
export function ValidateSchool(control): ValidationErrors | null {
  if (!AVAILABLE_SCHOOLS.includes(control.value)) return { invalidSchool: true };
  return null;
}
