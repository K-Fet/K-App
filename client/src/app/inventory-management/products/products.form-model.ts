import {
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Product } from './product.model';
import { Provider } from '../providers/provider.model';
import { URL_PATTERN } from '../../constants';
import { from } from 'rxjs';

const BASE_PRODUCT = {} as Product;

export function getProductModel(providers: Promise<Provider[]>, originalProduct?: Product): DynamicFormModel {
  const values = originalProduct || BASE_PRODUCT;

  const optionMap = (valueField, labelField) => arr => arr.map(b => ({
    value: b[valueField],
    label: b[labelField],
  }));

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom du produit',
      value: values.name,
      validators: { required: null },
    }),
    new DynamicInputModel({
      id: 'image',
      label: 'Lien vers une image',
      value: values.image,
      validators: { pattern: URL_PATTERN },
    }),
    new DynamicSelectModel<string>({
      id: 'provider',
      label: 'Fournisseur',
      value: values.provider && (values.provider as Provider)._id,
      disabled: values.used,
      options: from(providers.then(optionMap('_id', 'name')),
      ),
    }),
    new DynamicFormArrayModel({
      id: 'conversions',
      label: 'Liste des conversions',
      initialCount: 1,
      groupFactory: () => {
        return [
          new DynamicInputModel({
            id: 'displayName',
            label: 'Label',
          }),
          // TODO Preferred
          new DynamicInputModel({
            id: 'unit',
            label: 'Unité',
          }),
          new DynamicInputModel({
            id: 'coef',
            label: 'Facteur multiplicateur',
          }),
        ];
      },
    }),
    // TODO Shelve
  ];
}

export function getProductFromForm(form: FormGroup, originalProduct?: Product): Product {
  const value = form.value;
  const original = originalProduct || BASE_PRODUCT;

  return {
    _id: original._id,
    ...value,
  };
}
