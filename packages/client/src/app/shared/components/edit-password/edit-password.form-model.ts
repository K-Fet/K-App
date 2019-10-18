import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { validateEqual } from '../../validators/equal.validator';

export function getEditPasswordModel(): DynamicFormModel {
  return [
    new DynamicInputModel({
      id: 'oldPassword',
      label: 'Mot de passe actuel',
      inputType: 'password',
      validators: { required: null },
    }),
    new DynamicInputModel({
      id: 'newPassword',
      label: 'Nouveau mot de passe',
      inputType: 'password',
      validators: {
        required: null,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      },
      errorMessages: {
        pattern: 'Le nouveau mot de passe doit contenir au moins 8 caractères ' +
          'et doit avoir 1 minuscule, 1 majuscule et 1 chiffre.',
      },
    }),
    new DynamicInputModel({
      id: 'newPasswordConfirmation',
      label: 'Confirmation',
      inputType: 'password',
      validators: {
        required: null,
        validateEqual: {
          name: validateEqual.name,
          args: 'newPassword',
        },
      },
      errorMessages: {
        validateEqual: 'Les nouveaux mots de passe ne correspondent pas.',
      },
    }),
  ];
}

export function getPasswordFromForm(form: FormGroup): { oldPassword: string, newPassword: string } {
  return form.value;
}
