import { DynamicFormModel, DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Role } from '../../shared/models';
import { getDifference } from '../../../utils';

const BASE_ROLE = new Role({ permissions: [] });

export function getRoleModel(role?: Role): DynamicFormModel {
  const values = role || BASE_ROLE;

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom du rôle',
      value: values.name,
      validators: { required: null },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      label: 'Description',
      value: values.description,
      validators: { required: null },
    }),
  ];
}

export function getRoleFromForm(form: FormGroup, selectedPermissions: number[], role?: Role): Role {
  const value = form.value;
  const original = role || BASE_ROLE;

  const res = new Role({
    id: original.id,
    ...value,
  });

  res._embedded = {
    permissions: getDifference(original.permissions.map(p => p.id), selectedPermissions),
  };

  return res;
}
