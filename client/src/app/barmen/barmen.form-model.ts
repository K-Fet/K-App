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

const FACEBOOK_PATTERN =
  /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w\-]*\/)*([\w\-.]+)(\/)?/i;

export function getBarmanModel(barmen: Observable<Barman[]>,
                               kommissions: Observable<Kommission[]>,
                               roles: Observable<Role[]>): DynamicFormModel {
  return [
    new DynamicFormGroupModel({
      id: 'info1',
      legend: 'Informations personnelles',
      group: [
        new DynamicInputModel({
          id: 'lastName',
          label: 'Nom de famille',
          validators: { required: null },
        }),
        new DynamicInputModel({
          id: 'firstName',
          label: 'Prénom',
          validators: { required: null },
        }),
        new DynamicDatePickerModel({
          id: 'dateOfBirth',
          label: 'Date de naissance',
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
          validators: {
            required: null,
            email: null,
          },
        }),
      ],
    }),
    new DynamicFormGroupModel({
      id: '_embedded',
      legend: 'Informations relative à la K-Fêt',
      group: [
        new DynamicInputModel({
          id: 'nickName',
          label: 'Surnom',
        }),
        new DynamicTextAreaModel({
          id: 'flow',
          label: 'Cheminement',
          validators: { required: null },
        }),
        new DynamicSelectModel<number>({
          id: 'godFather',
          label: 'Parrain ou marraine',
          options: barmen.pipe(map(arr => arr.map(b => ({ value: b.id, label: b.nickname }))),
          ),
        }),
        new DynamicSelectModel<number>({
          id: 'roles',
          label: 'Roles',
          multiple: true,
          options: kommissions.pipe(map(arr => arr.map(r => ({ value: r.id, label: r.name }))),
          ),
        }),
        new DynamicSelectModel<number>({
          id: 'kommissions',
          label: 'Kommissions',
          multiple: true,
          options: roles.pipe(map(arr => arr.map(k => ({ value: k.id, label: k.name }))),
          ),
        }),
      ],
    }),
  ];
}

export function getBarmanFromForm(form: FormGroup): Barman {
  // TODO Fix structure
  return new Barman(form.value);
}
