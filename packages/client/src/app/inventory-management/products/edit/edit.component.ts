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
import { ShelvesService } from '../../api-services/shelves.service';

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
              private shelvesService: ShelvesService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { product: Product }) => {
      this.originalProduct = data.product;
      this.model = getProductModel(
        this.shelvesService.listAll(),
        this.providersService.listAll(),
        this.originalProduct,
      );
      this.formGroup = this.formService.createFormGroup(this.model);
      this.formConversionArray = this.formGroup.get('conversions') as FormArray;
      this.formConversionModel = this.formService.findById('conversions', this.model) as DynamicFormArrayModel;
    });
  }

  addConversionLine(): void {
    this.formService.addFormArrayGroup(this.formConversionArray, this.formConversionModel);
  }

  removeItem(context: DynamicFormArrayModel, index: number): void {
    this.formService.removeFormArrayGroup(index, this.formConversionArray, context);
  }

  async onNgSubmit(): Promise<void> {
    const updatedProduct = getProductFromForm(this.formGroup, this.originalProduct);
    await this.productsService.update(updatedProduct);
    this.toasterService.showToaster('Produit mis à jour');
    this.router.navigate(['/inventory-management/products']);
  }

  async removeProduct(): Promise<void> {
    this.productsService.remove(this.originalProduct._id).then((res) => {
      if(res) this.toasterService.showToaster("Le produit a bien été supprimé");
    })
    .catch( err => {
      this.toasterService.showToaster("une erreur est survenue");
      console.error(err);
    });
    this.router.navigate(['/inventory-management/products']);
  }
}
