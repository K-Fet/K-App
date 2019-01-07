import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Product } from './product.model';

const BASE_PRODUCT = {} as Product;

export function getProductModel(originalProduct?: Product): DynamicFormModel {
  const values = originalProduct || BASE_PRODUCT;

  return [
    new DynamicInputModel({
      id: 'name',
      label: 'Nom du fournisseur',
      value: values.name,
      validators: { required: null },
    }),
    // TODO
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
