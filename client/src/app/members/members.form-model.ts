import { DynamicFormModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Member } from './member.model';

const BASE_MEMBER: Member = {} as Member;

export function getMemberModel(originalMember?: Member): DynamicFormModel {
  // const values = originalMember || BASE_MEMBER;

  return [];
}

export function getMemberFromForm(form: FormGroup, originalMember?: Member): Member {
  const value = form.value;
  const original = originalMember || BASE_MEMBER;

  return {
    _id: original._id,
    ...value,
  };
}
