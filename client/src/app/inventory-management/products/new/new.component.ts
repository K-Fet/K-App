import { Component, OnInit } from '@angular/core';
import {
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { getProductFromForm, getProductModel } from '../products.form-model';
import { ProductsService } from '../../api-services/products.service';
import { ProvidersService } from '../../api-services/providers.service';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  formConversionArray: FormArray;
  formConversionModel: DynamicFormArrayModel;

  constructor(private formService: DynamicFormService,
              private productsService: ProductsService,
              private providersService: ProvidersService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getProductModel(
      // TODO Improve page size
      this.providersService.list({ pageSize: 1000 }).then(value => value.rows),
    );
    this.formGroup = this.formService.createFormGroup(this.model);
    this.formConversionArray = this.formGroup.get('conversions') as FormArray;
    this.formConversionModel = this.formService.findById('conversions', this.model) as DynamicFormArrayModel;
  }

  addConversionLine() {
    this.formService.addFormArrayGroup(this.formConversionArray, this.formConversionModel);
  }

  removeItem(context: DynamicFormArrayModel, index: number) {
    this.formService.removeFormArrayGroup(index, this.formConversionArray, context);
  }

  async onNgSubmit() {
    await this.productsService.create(getProductFromForm(this.formGroup));
    this.toasterService.showToaster('Produit créé');
    this.router.navigate(['/inventory-management/products']);
  }
}
