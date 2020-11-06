import {
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicDatePickerModel,
} from '@ng-dynamic-forms/core';
import { FormGroup, } from '@angular/forms';
import { StockEvent } from './stock-events.model';
import { from } from 'rxjs';
import { Product } from '../products/product.model';
import { subYears } from 'date-fns';

const BASE_STOCKEVENTS = {} as StockEvent;

export function getStockEventsModel(
  products: Promise<Product[]>,
  originalStockEvent?: StockEvent,
): DynamicFormModel {

  const values = originalStockEvent || BASE_STOCKEVENTS;

  const optionMap = (valueField, labelField) => arr => arr.map(b => ({
    value: b[valueField],
    label: b[labelField],
  }));

  const eventTypes = [
    {
      label: 'Vente',
      value: 'Transaction',
    }, 
    {
      label: 'Réception',
      value: 'Delivery',
    }];
  

  return [
    new DynamicSelectModel<string>({
      id: 'product',
      label: 'Produit',
      value: values.product && (values.product as Product)._id,
      validators: { required: null },
      options: from(products.then(optionMap('_id', 'name')),
      ),
    }),
    new DynamicInputModel({
      id: 'diff',
      label: 'Quantité (positive ou négative)',
      value: values.diff,
      validators: { required: null },
    }),
    new DynamicDatePickerModel({
      id: 'date',
      label: 'Date',
      value: values.date,
      validators: { required: null },
      additional: {
        pickerType: 'calendar',
        startView: 'multi-years',
        startAt: subYears(new Date(), 20),
      },
    }),
    new DynamicSelectModel<string>({
      id: 'type',
      label: 'Type de l\'évènement',
      value: values.type,
      options: eventTypes,
      validators: { required: null },
    }),
    new DynamicInputModel({
      id: 'order',
      label: 'Facture associée',
      value: values.order,
    }),
    new DynamicInputModel({
      id: 'meta',
      label: 'Informations complémentaires',
      value: values.meta,
    }),
  ];
}

export function getStockEventFromForm(form: FormGroup, originalStockEvent?: StockEvent): StockEvent {
  const value = form.value;
  const original = originalStockEvent || BASE_STOCKEVENTS;
  return {
    _id: original._id,
    ...value,
  };
}



