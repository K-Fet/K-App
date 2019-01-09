import { Component, OnInit } from '@angular/core';
import {
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { Product } from '../product.model';
import { ProductsService } from '../../api-services/products.service';
import { getProductFromForm, getProductModel } from '../products.form-model';
import { ProvidersService } from '../../api-services/providers.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  formConversionArray: FormArray;
  formConversionModel: DynamicFormArrayModel;

  originalProduct: Product;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private productsService: ProductsService,
              private providersService: ProvidersService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { product: Product }) => {
      this.originalProduct = data.product;
      this.model = getProductModel(
        this.providersService.list({ pageSize: 1000 }).then(value => value.rows),
        this.originalProduct,
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
    const updatedProduct = getProductFromForm(this.formGroup, this.originalProduct);
    await this.productsService.update(updatedProduct);
    this.toasterService.showToaster('Produit mis à jour');
    this.router.navigate(['/inventory-management/products']);
  }
}
