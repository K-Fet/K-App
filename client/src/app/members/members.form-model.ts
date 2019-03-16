import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Member } from './member.model';
import { AVAILABLE_SCHOOLS, SCHOOLS_REGEXP } from '../constants';

const BASE_MEMBER: Member = {} as Member;

export function getMemberModel(originalMember?: Member): DynamicFormModel {
  const values = originalMember || BASE_MEMBER;

  return [
    new DynamicInputModel({
      id: 'firstName',
      label: 'Prénom',
      value: values.firstName,
      validators: { required: null },
    }),
    new DynamicInputModel({
      id: 'lastName',
      label: 'Nom',
      value: values.lastName,
      validators: { required: null },
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

  return {
    _id: original._id,
    ...value,
  };
}
