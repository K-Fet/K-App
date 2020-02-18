import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { subYears } from 'date-fns';
import { AccountType, Barman, ServiceAccount, User } from '../../shared/models';

const baseUserFactory = (accountType: AccountType): User => {
  if (accountType === AccountType.BARMAN) {
    return {
      accountType,
      account: {
        lastName: '',
        firstName: '',
        nickName: '',
        dateOfBirth: subYears(new Date(), 19),
        kommissions: [],
        roles: [],
        services: [],
      },
    };
  }

  if (accountType === AccountType.SERVICE) {
    return {
      accountType,
      account: {
        code: '',
        description: '',
        permissions: [],
      },
    };
  }
};

export function getBarmanFormModel(account?: Barman): DynamicFormModel {
  return [
    new DynamicInputModel({
      id: 'account.firstName',
      label: 'Prénom',
      value: account.firstName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'account.lastName',
      label: 'Nom',
      value: account.lastName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'account.nickName',
      label: 'Surnom',
      value: account.nickName,
      validators: {
        required: null,
      },
    }),
    new DynamicInputModel({
      id: 'account.facebook',
      label: 'Facebook',
      value: account.facebook,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      pattern: /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w-]*\/)*([\w\-.]+)(\/)?/i,
    }),
  ];
}

export function getServiceFormModel(account?: ServiceAccount): DynamicFormModel {
  return [
    new DynamicInputModel({
      id: 'account.description',
      label: 'Description',
      value: account.description,
      validators: {
        required: null,
      },
    }),
  ];
}

export function getUserModel(accountType: AccountType, originalUser?: User): DynamicFormModel {
  if (originalUser && originalUser.accountType !== accountType) {
    throw new Error('User accountType don\'t match');
  }

  const values = originalUser || baseUserFactory(AccountType.BARMAN);

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
    ...((): DynamicFormModel => {
      switch (accountType) {
        case AccountType.BARMAN:
          return getBarmanFormModel(originalUser.account as Barman);
        case AccountType.SERVICE:
          return getServiceFormModel(originalUser.account as ServiceAccount);
      }
    })(),
  ];
}

export function getUserFromForm(form: FormGroup, accountType: AccountType, originalUser?: User): User {
  const value = form.value;
  const original = originalUser || baseUserFactory(accountType);

  return {
    ...originalUser,
    ...value,
    account: {
      ...original.account,
      ...value.account,
    },
  };
}
