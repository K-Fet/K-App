import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditArticleDialogComponent } from '../../articles/edit-article-dialog/edit-article-dialog.component';
import { Product } from 'src/app/inventory-management/products/product.model';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicSelectModel, DynamicFormService, DynamicFormOptionConfig } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs';
import { ProductsService } from 'src/app/inventory-management/api-services/products.service';

@Component({
  selector: 'app-choose-product-dialog',
  templateUrl: './choose-product-dialog.component.html',
  styleUrls: ['./choose-product-dialog.component.scss']
})
export class ChooseProductDialogComponent {

  public formGroup: FormGroup;
  public dynamicFormModel: DynamicFormModel;
  public productOptions: Subject<DynamicFormOptionConfig<string>[]>;

  constructor(
    public dialogRef: MatDialogRef<EditArticleDialogComponent>,
    public formService: DynamicFormService,
    public productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: {
      articleName: string;
      products: Product[];
    },
  ) {
    this.productOptions = new Subject();
    this.productOptions.next(this.data.products.map(product => {return {
      value: product._id,
      label: product.name,
    }}));

    this.dynamicFormModel = [
      new DynamicSelectModel<string>({
        id: 'product',
        label: 'Produit',
        validators: { required: null },
        options: this.productOptions,
      }),
    ];
    this.formGroup = this.formService.createFormGroup(this.dynamicFormModel);
   }

  public changeFilterValue(event): void{
    this.productsService.list({
      search: event.target.value,
    }).then((res) => 
    {  
      this.productOptions.next(res.rows.map(product => {
        return {
          value: product._id,
          label: product.name,
        }
      }));
    });
  }

  public onNgSubmit(): void {
    if(this.formGroup.valid){
      this.dialogRef.close({
        product: this.formGroup.get('product').value,
      })
    }
  }
}
