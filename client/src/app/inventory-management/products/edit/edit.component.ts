import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { getProductFromForm, getProductModel } from '../products.form-model';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalProduct: Product;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { product: Product }) => {
      this.originalProduct = data.product;
      this.model = getProductModel(this.originalProduct);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  async onNgSubmit() {
    const updatedProvider = getProductFromForm(this.formGroup, this.originalProduct);
    await this.productsService.update(updatedProvider);
    this.toasterService.showToaster('Produit mise à jour');
    this.router.navigate(['/inventory-management/products']);
  }
}
