import { DynamicFormModel, DynamicInputModel } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Shelf } from './shelf.model';

const BASE_SHELF: Shelf = {} as Shelf;

export function getShelfModel(originalShelf?: Shelf): DynamicFormModel {
  const values = originalShelf || BASE_SHELF;

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom du rayon',
      value: values.name,
      validators: { required: null },
    }),
  ];
}

export function getShelfFromForm(form: FormGroup, originalShelf?: Shelf): Shelf {
  const value = form.value;
  const original = originalShelf || BASE_SHELF;

  return {
    _id: original._id,
    ...value,
  };
}
