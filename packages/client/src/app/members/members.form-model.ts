import { DynamicFormModel, DynamicInputModel } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Member } from './member.model';
import { AVAILABLE_SCHOOLS, SCHOOLS_REGEXP } from '../constants';

const BASE_MEMBER: Member = {} as Member;

export function getMemberModel(originalMember?: Member): DynamicFormModel {
  const values = originalMember || BASE_MEMBER;

  return [
    new DynamicInputModel({
      id: 'lastName',
      label: 'Nom',
      value: values.lastName,
      validators: { required: null, min: 3 },
    }),
    new DynamicInputModel({
      id: 'firstName',
      label: 'Prénom',
      value: values.firstName,
      validators: { required: null, min: 3 },
    }),
    new DynamicInputModel({
      id: 'school',
      label: 'École',
      value: values.school,
      list: AVAILABLE_SCHOOLS,
      validators: {
        pattern: SCHOOLS_REGEXP,
      },
      errorMessages: {
        pattern: 'L\'école doit être dans la liste proposée',
      },
    }),
  ];
}

export function getMemberFromForm(form: FormGroup, originalMember?: Member): Member {
  const value = form.value;
  const original = originalMember || BASE_MEMBER;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.substring(1);
  const capitalizeName = (str: string) => {
    if (!str) return null;
    return str
      .toLowerCase()
      .split(' ')
      .map(capitalize)
      .join(' ')
      .split('-')
      .map(capitalize)
      .join('-');
  };

  return {
    _id: original._id,
    ...value,
    firstName: capitalizeName(value.firstName),
    lastName: capitalizeName(value.lastName),
  };
}
