import { DynamicFormModel, DynamicInputModel } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Provider } from './provider.model';
import { URL_PATTERN } from '../../constants';

const BASE_PROVIDER = {} as Provider;

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
      value: values.link,
      validators: { pattern: URL_PATTERN },
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
