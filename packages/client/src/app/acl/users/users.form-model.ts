import {
  DynamicDatePickerModel,
  DynamicFormGroupModel,
  DynamicFormModel,
  DynamicInputModel, DynamicSelectModel, DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { subYears } from 'date-fns';
import { AccountType, Barman, Kommission, Role, ServiceAccount, User } from '../../shared/models';
import { from } from 'rxjs';

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
    new DynamicDatePickerModel({
      id: 'dateOfBirth',
      label: 'Date de naissance',
      value: account.dateOfBirth,
      validators: { required: null },
      additional: {
        pickerType: 'calendar',
        startView: 'multi-years',
        startAt: subYears(new Date(), 20),
      },
    }),
    new DynamicTextAreaModel({
      id: 'flow',
      label: 'Cheminement',
      value: account.flow,
      validators: { required: null },
    }),
    new DynamicDatePickerModel({
      id: 'leaveAt',
      label: 'Date de départ',
      // Disable input when creating
      disabled: !account,
      value: account.leaveAt,
      additional: {
        pickerType: 'calendar',
        startView: 'multi-years',
      },
    }),
    new DynamicInputModel({
      id: 'facebook',
      label: 'Facebook',
      value: account.facebook,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      pattern: /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w-]*\/)*([\w\-.]+)(\/)?/i,
    }),
    new DynamicSelectModel<string>({
      id: 'godFather',
      label: 'Parrain ou marraine',
      value: account.godFather && (account.godFather as User)._id,
      options: from(barmen.then(optionMap('_id', 'nickname')),
      ),
    }),
    new DynamicSelectModel<string>({
      id: 'roles',
      label: 'Roles',
      multiple: true,
      value: (account.roles as Role[]).map(r => r._id),
      options: from(roles.then(optionMap('id', 'name'))),
    }),
    new DynamicSelectModel<string>({
      id: 'kommissions',
      label: 'Kommissions',
      multiple: true,
      value: (account.kommissions as Kommission[]).map(k => k._id),
      options: from(kommissions.then(optionMap('id', 'name'))),
    }),
  ];
}

export function getServiceFormModel(account?: ServiceAccount): DynamicFormModel {
  return [
    new DynamicInputModel({
      id: 'description',
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

  const values = originalUser || baseUserFactory(accountType);

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
    new DynamicFormGroupModel({
      id: 'account',
      legend: 'Compte',
      group: ((): DynamicFormModel => {
        switch (accountType) {
          case AccountType.BARMAN:
            return getBarmanFormModel(values.account as Barman);
          case AccountType.SERVICE:
            return getServiceFormModel(values.account as ServiceAccount);
        }
      })(),
    }),
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
