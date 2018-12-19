import { DynamicFormModel, DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Provider } from 'nconf';

const BASE_PROVIDER: Provider = {};

export function getProviderModel(originalProvider?: Provider): DynamicFormModel {
  const values = originalProvider || BASE_PROVIDER;

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom du fournisseur',
      value: values.name,
      validators: { required: null },
    }),
    new DynamicTextAreaModel({
      id: 'link',
      label: 'Lien vers le fournisseur',
      value: values.description,
    }),
  ];
}

export function getProviderFromForm(form: FormGroup, originalProvider?: Provider): Provider {
  const value = form.value;
  const original = originalProvider || BASE_PROVIDER;

  return {
    _id: original._id,
    ...value,
  };
}
