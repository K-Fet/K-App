import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { AccountType, Barman, User } from '../../shared/models';

const BASE_USER: User = { accountType: AccountType.BARMAN };

export function getBarmanFormModel(originalUser?: Barman): DynamicFormModel {
  const account = originalUser || {} as Barman;
  return [
    new DynamicInputModel({
      id: 'firstName',
      label: 'Prénom',
      value: account.firstName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'lastName',
      label: 'Nom',
      value: account.lastName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'nickName',
      label: 'Surnom',
      value: account.nickName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'facebook',
      label: 'Facebook',
      value: account.facebook,
      pattern: /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w-]*\/)*([\w\-.]+)(\/)?/i,
    }),
  ];
}

export function getUserModel(accountType: AccountType, originalUser?: User): DynamicFormModel {
  if (originalUser && originalUser.accountType !== accountType) {
    throw new Error('User accountType don\'t match');
  }

  const values = originalUser || BASE_USER;

  return [
    new DynamicInputModel({
      id: 'email',
      label: 'Adresse email',
      inputType: 'email',
      value: values.email,
      validators: {
        required: null,
        email: null,
      },
    }),
  ];
}

export function getUserFromForm(form: FormGroup, originalUser?: User): User {
  const value = form.value;
  const original = originalUser || BASE_USER;

  return value;
}
