import { DynamicFormModel } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { ServicesTemplate } from '../../shared/models';

const BASE_TEMPLATE = {} as ServicesTemplate;

export function getTemplateModel(_originalTemplate?: ServicesTemplate): DynamicFormModel {
  // TODO Move to a dynamic form
  return [];
}

export function getTemplateFromForm(form: FormGroup, originalTemplate?: ServicesTemplate): ServicesTemplate {
  const value = form.value;
  const original = originalTemplate || BASE_TEMPLATE;

  return {
    id: original._id,
    ...value,
  };
}
