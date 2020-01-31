import { DynamicFormModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Template } from '../../shared/models';

const BASE_TEMPLATE = {} as Template;

export function getTemplateModel(_originalTemplate?: Template): DynamicFormModel {
  // TODO Move to a dynamic form
  return [];
}

export function getTemplateFromForm(form: FormGroup, originalTemplate?: Template): Template {
  const value = form.value;
  const original = originalTemplate || BASE_TEMPLATE;

  return {
    id: original._id,
    ...value,
  };
}
