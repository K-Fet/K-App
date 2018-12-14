import { DynamicFormModel, DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { Kommission } from '../shared/models';
import { FormGroup } from '@angular/forms';

const BASE_KOMMISSION = new Kommission({});

export function getKommissionModel(originalKommission?: Kommission): DynamicFormModel {
  const values = originalKommission || BASE_KOMMISSION;

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom de famille',
      value: values.name,
      validators: { required: null },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      label: 'Description',
      value: values.description,
    }),
  ];
}

export function getKommissionFromForm(form: FormGroup, originalKommission?: Kommission): Kommission {
  const value = form.value;
  const original = originalKommission || BASE_KOMMISSION;

  return new Kommission({
    id: original.id,
    ...value,
  });
}
