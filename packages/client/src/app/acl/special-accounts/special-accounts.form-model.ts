import {
  DynamicFormGroupModel,
  DynamicFormModel,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { SpecialAccount } from '../../shared/models';
import { validateEqual } from '../../shared/validators/equal.validator';
import { getDifference } from '../../../utils';

const BASE_SPECIAL_ACCOUNT = new SpecialAccount({ permissions: [], connection: {} });

function getCodeForm(isEdit = false) {
  const codeValidators: any = {
    pattern: /^[0-9]{4,}$/,
  };
  const codeConfirmationValidators: any = {
    validateEqual: {
      name: validateEqual.name,
      args: 'code',
    },
  };

  if (!isEdit) {
    codeValidators.required = null;
    codeConfirmationValidators.required = null;
  }

  return [
    new DynamicInputModel({
      id: 'code',
      label: 'Code',
      validators: codeValidators,
      errorMessages: {
        pattern: 'Le code doit comporter seulement des chiffres, 4 au minimum.',
      },
    }),
    new DynamicInputModel({
      id: 'codeConfirmation',
      label: 'Confirmation du code',
      validators: codeConfirmationValidators,
      errorMessages: {
        validateEqual: 'Les codes doivent être identiques.',
      },
    }),
  ];
}

export function getSpecialAccountModel(originalSpecialAccount?: SpecialAccount): DynamicFormModel {
  const values = originalSpecialAccount || BASE_SPECIAL_ACCOUNT;

  return [
    new DynamicFormGroupModel({
      id: 'connection',
      legend: 'Informations de connection',
      group: [
        new DynamicInputModel({
          id: 'email',
          label: 'Adresse email',
          value: values.connection && values.connection.email,
          validators: {
            required: null,
            email: null,
          },
        }),
      ],
    }),
    new DynamicFormGroupModel({
      id: 'info1',
      legend: 'Informations personnelles',
      group: [
        ...getCodeForm(!!originalSpecialAccount),
        new DynamicInputModel({
          id: 'description',
          label: 'Description',
          value: values.description,
          validators: { required: null },
        }),
      ],
    }),
  ];
}

export function getSpecialAccountFromForm(form: FormGroup,
                                          selectedPermissions: number[],
                                          originalSpecialAccount?: SpecialAccount): SpecialAccount {
  const value = form.value;
  const original = originalSpecialAccount || BASE_SPECIAL_ACCOUNT;

  const res = new SpecialAccount({
    id: original.id,
    ...value.info1,
    // Remove null field
    code: value.info1.code || undefined,
    // Remove useless field
    codeConfirmation: undefined,
    connection: value.connection,
  });

  res._embedded = {
    permissions: getDifference(original.permissions.map(p => p.id), selectedPermissions),
  };

  return res;
}
