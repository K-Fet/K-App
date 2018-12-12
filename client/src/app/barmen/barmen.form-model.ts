import {
  DynamicDatePickerModel,
  DynamicFormGroupModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import { subYears } from 'date-fns';
import { Barman, Kommission, Role } from '../shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { getDifference } from '../../utils';

const FACEBOOK_PATTERN =
  /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w\-]*\/)*([\w\-.]+)(\/)?/i;

const BASE_BARMAN = new Barman({
  connection: {}, roles: [], kommissions: [], godFather: {}, services: [],
});

export function getBarmanModel(barmen: Observable<Barman[]>,
                               kommissions: Observable<Kommission[]>,
                               roles: Observable<Role[]>,
                               originalBarman?: Barman): DynamicFormModel {
  const values = originalBarman || BASE_BARMAN;

  return [
    new DynamicFormGroupModel({
      id: 'info1',
      legend: 'Informations personnelles',
      group: [
        new DynamicInputModel({
          id: 'lastName',
          label: 'Nom de famille',
          value: values.lastName,
          validators: { required: null },
        }),
        new DynamicInputModel({
          id: 'firstName',
          label: 'Prénom',
          value: values.firstName,
          validators: { required: null },
        }),
        new DynamicDatePickerModel({
          id: 'dateOfBirth',
          label: 'Date de naissance',
          value: values.dateOfBirth,
          validators: { required: null },
          additional: {
            pickerType: 'calendar',
            startView: 'multi-years',
            startAt: subYears(new Date(), 20),
          },
        }),
        new DynamicInputModel({
          id: 'facebook',
          label: 'Facebook (un lien URL)',
          value: values.facebook,
          validators: {
            pattern: FACEBOOK_PATTERN,
          },
        }),
      ],
    }),
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
      id: 'info2',
      legend: 'Informations relative à la K-Fêt',
      group: [
        new DynamicInputModel({
          id: 'nickName',
          label: 'Surnom',
          value: values.nickname,
        }),
        new DynamicTextAreaModel({
          id: 'flow',
          label: 'Cheminement',
          value: values.flow,
          validators: { required: null },
        }),
        new DynamicDatePickerModel({
          id: 'leaveAt',
          label: 'Date de départ',
          // Disable input when creating
          disabled: !originalBarman,
          additional: {
            pickerType: 'calendar',
            startView: 'multi-years',
          },
        }),
        new DynamicSelectModel<number>({
          id: 'godFather',
          label: 'Parrain ou marraine',
          value: values.godFather && values.godFather.id,
          options: barmen.pipe(map(arr => arr.map(b => ({ value: b.id, label: b.nickname }))),
          ),
        }),
        new DynamicSelectModel<number>({
          id: 'roles',
          label: 'Roles',
          multiple: true,
          value: values.roles.map(r => r.id),
          options: roles.pipe(map(arr => arr.map(r => ({ value: r.id, label: r.name }))),
          ),
        }),
        new DynamicSelectModel<number>({
          id: 'kommissions',
          label: 'Kommissions',
          multiple: true,
          value: values.kommissions.map(k => k.id),
          options: kommissions.pipe(map(arr => arr.map(k => ({ value: k.id, label: k.name }))),
          ),
        }),
      ],
    }),
  ];
}

export function getBarmanFromForm(form: FormGroup, originalBarman?: Barman): Barman {
  const value = form.value;
  const original = originalBarman || BASE_BARMAN;

  const res = new Barman({
    id: original.id,
    ...value.info1,
    connection: value.connection,
    flow: value.info2.flow,
    nickname: value.info2.nickName,
  });

  res._embedded = {
    kommissions: getDifference(original.kommissions.map(k => k.id), value.info2.kommissions),
    roles: getDifference(original.roles.map(r => r.id), value.info2.roles),
  };

  if (value.info2.godFather && original.godFather.id !== value.info2.godFather) {
    res._embedded.godFather = value.info2.godFather;
  }

  return res;
}
