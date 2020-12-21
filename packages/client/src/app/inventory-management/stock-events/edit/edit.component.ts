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

  public ngOnInit(): void { 
    this.formGroup = this.formService.createFormGroup([]);
    this.route.data.subscribe((data: { stockEvent: StockEvent }) => {
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

  public async removeStockEvent(): Promise<void> {
    this.stockEventsService.remove(this.originalEvent._id).then((res) => {
      if(res) this.toasterService.showToaster("L'évènement a bien été supprimé");
    })
    .catch( err => {
      this.toasterService.showToaster("Une erreur est survenue");
      console.error(err);
    });
    this.router.navigate(['/inventory-management/stock-events']);
  }

  public async onNgSubmit(): Promise<void> {
    const updatedEvent = getStockEventFromForm(this.formGroup, this.originalEvent);
    await this.stockEventsService.update(updatedEvent);
    this.toasterService.showToaster('Produit mis à jour');
    this.router.navigate(['/inventory-management/stock-events']);
  }
}
