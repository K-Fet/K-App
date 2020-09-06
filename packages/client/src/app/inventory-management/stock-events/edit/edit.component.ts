import { Component, OnInit } from '@angular/core';
import {
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { StockEvent } from '../stock-events.model';
import { StockEventsService } from '../../api-services/stock-events.service';
import { getStockEventFromForm, getStockEventsModel } from '../stock-events.form-model';
import { ProductsService } from '../../api-services/products.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  formConversionArray: FormArray;
  formConversionModel: DynamicFormArrayModel;

  originalEvent: StockEvent;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private productsService: ProductsService,
              private stockEventsService: StockEventsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { stockEvent: StockEvent }) => { //TODO inscrire le produit en amont
      this.originalEvent = data.stockEvent;
      this.model = getStockEventsModel(
        this.productsService.list({ pageSize: 1000 }).then(value => value.rows),
        this.originalEvent,
      );
      this.formGroup = this.formService.createFormGroup(this.model);
      this.formConversionArray = this.formGroup.get('conversions') as FormArray;
      this.formConversionModel = this.formService.findById('conversions', this.model) as DynamicFormArrayModel;
    });
  }

  addConversionLine() {
    this.formService.addFormArrayGroup(this.formConversionArray, this.formConversionModel);
  }

  removeItem(context: DynamicFormArrayModel, index: number) {
    // TODO Check if it was here before
    this.formService.removeFormArrayGroup(index, this.formConversionArray, context);
  }

  async onNgSubmit() {
    const updatedEvent = getStockEventFromForm(this.formGroup, this.originalEvent);
    await this.stockEventsService.update(updatedEvent);
    this.toasterService.showToaster('Produit mis à jour');
    this.router.navigate(['/inventory-management/products']);
  }
}
