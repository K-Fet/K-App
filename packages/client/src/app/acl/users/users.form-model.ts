import {
  AUTOCOMPLETE_OFF,
  DynamicDatePickerModel,
  DynamicFormGroupModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicInputModelConfig,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms2/core';
import { FormGroup } from '@angular/forms';
import { subYears } from 'date-fns';
import { AccountType, Barman, ServiceAccount, User } from '../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../../core/api-services/users.service';

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

function createInputFromAsync<T>({ config, loader, displayWith }: {
  config: DynamicInputModelConfig;
  loader: (str: string) => Promise<T[]>;
  displayWith: (option?: T) => string;
}): DynamicInputModel {
  const filterSubject = new BehaviorSubject<string>('');

  const model = new DynamicInputModel({
    ...config,
    list: filterSubject.pipe(switchMap(loader)),
    autoComplete: AUTOCOMPLETE_OFF,
    additional: {
      matAutocomplete: 'auto',
      displayWith,
      optionLabel: '_id',
    },
  });

  model.valueChanges.subscribe(value => filterSubject.next(value as string));
  return model;
}

export function getBarmanFormModel(userService: UsersService, account?: Barman): DynamicFormModel {
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
    createInputFromAsync<User>({
      config: {
        id: 'godFather',
        label: 'Parrain ou marraine',
        value: account.godFather && (account.godFather as User)._id,
      },
      displayWith: (user) => user && user.email,
      loader: (search) => userService.find({ accountType: AccountType.BARMAN, search }),
    }),
    // createInputFromAsync<Role>({
    //   config: {
    //     id: 'roles',
    //     label: 'Roles',
    //     value: (account.roles as Role[]).map(r => r._id),
    //     multiple: true,
    //   },
    //   displayWith: (role) => role.name,
    //   loader: (search) => userService.find({ accountType: AccountType.BARMAN, search }),
    // }),
    // new DynamicSelectModel<string>({
    //   id: 'roles',
    //   label: 'Roles',
    //   multiple: true,
    //   value: (account.roles as Role[]).map(r => r._id),
    // }),
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

export function getUserModel(accountType: AccountType, usersService: UsersService, originalUser?: User): DynamicFormModel {
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
            return getBarmanFormModel(usersService, values.account as Barman);
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
