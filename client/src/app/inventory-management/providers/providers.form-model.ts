import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
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
    new DynamicInputModel({
      id: 'link',
      label: 'Lien vers le fournisseur',
      value: values.description,
      validators: { pattern: '(https?://)([\\\\da-z.-]+)\\\\.([a-z.]{2,6})[/\\\\w .-]*/?' },
      errorMessages: {
        pattern: 'Cela ne ressemble pas à une URL valide',
      },
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
