import { DynamicFormModel, DynamicInputModel, DynamicTextAreaModel } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Permission, Role } from '../../shared/models';

const BASE_ROLE = { permissions: [] } as Role;

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

export function getRoleFromForm(form: FormGroup, selectedPermissions: Permission[], role?: Role): Role {
  const value = form.value;
  const original = role || BASE_ROLE;

  return {
    id: original._id,
    ...value,
    permissions: selectedPermissions,
  };
}
