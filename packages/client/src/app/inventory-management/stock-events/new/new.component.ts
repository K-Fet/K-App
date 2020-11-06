import { Component, OnInit } from '@angular/core';
import {
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { getStockEventFromForm, getStockEventsModel } from '../stock-events.form-model';
import { ProductsService } from '../../api-services/products.service';
import { StockEventsService } from '../../api-services/stock-events.service';

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
              private stockEventsService: StockEventsService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getStockEventsModel(
      this.productsService.list({ pageSize: 1000 }).then(value => value.rows),
    );
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  removeItem(context: DynamicFormArrayModel, index: number) {
    this.formService.removeFormArrayGroup(index, this.formConversionArray, context);
  }

  async onNgSubmit() {
    await this.stockEventsService.create(getStockEventFromForm(this.formGroup));
    this.toasterService.showToaster('Evenement créé');
    this.router.navigate(['/inventory-management/stock-events']);
  }
}
