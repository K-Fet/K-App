import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Article } from '../../article';
import {
  DynamicFormModel,
  DynamicSelectModel,
  DynamicInputModel,
  DynamicDatePickerModel,
  DynamicFormService,
  DynamicFormOptionConfig,
  DynamicFormArrayModel,
} from '@ng-dynamic-forms/core';
import { ProductsService } from 'src/app/inventory-management/api-services/products.service';
import { Subject } from 'rxjs';
import { subYears } from 'date-fns';
import { ProvidersService } from 'src/app/inventory-management/api-services/providers.service';
import { ShelvesService } from 'src/app/inventory-management/api-services/shelves.service';
import { Product } from 'src/app/inventory-management/products/product.model';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { getProductModel } from 'src/app/inventory-management/products/products.form-model';

@Component({
  selector: 'app-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html',
  styleUrls: ['./edit-article-dialog.component.scss'],
})
export class EditArticleDialogComponent implements OnInit {

  public articleFormGroup: FormGroup;
  public articleOptionsFormModel: DynamicFormModel;

  public productFormGroup: FormGroup;
  public productOptionsFormModel: DynamicFormModel;

  public productsPromise: Promise<Product[]>;
  public products: Product[] = [];

  public formConversionArray: FormArray;
  public formConversionModel: DynamicFormArrayModel;

  public filterFormControl: FormControl = new FormControl('');
  public productOptions: Subject<DynamicFormOptionConfig<string>[]>;

  constructor(
    public dialogRef: MatDialogRef<EditArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public article: Article,
    private readonly productsService: ProductsService,
    private readonly providersService: ProvidersService,
    private readonly shelvesService: ShelvesService,
    private readonly formService: DynamicFormService,
    private readonly toaster: ToasterService,
  ) {
    this.productsPromise = this.productsService.listAll();
    this.productOptions = new Subject();

    this.articleOptionsFormModel = [
      new DynamicSelectModel<string>({
        id: 'product',
        label: 'Produit',
        value: article.name,
        validators: { required: null },
        options: this.productOptions,
      }),
      new DynamicInputModel({
        id: 'quantity',
        label: 'Quantité',
        value: article.quantity,
        validators: { required: null },
        inputType: 'number',
      }),
      new DynamicDatePickerModel({
        id: 'date',
        label: 'Date',
        value: article.date,
        validators: { required: null },
        additional: {
          pickerType: 'calendar',
          startView: 'multi-years',
          startAt: subYears(new Date(), 20),
        },
      }),
    ];

    this.articleFormGroup = this.formService.createFormGroup(this.articleOptionsFormModel);
  }

  public async ngOnInit(): Promise<void> {
    this.products = await this.productsPromise;
    this.productOptions.next(await this.productsPromise.then(this.optionMapFilter('name')));
  }

  addProduct(articleName: string): void {

    const providers = this.providersService.listAll();
    const shelves = this.shelvesService.listAll();

    this.productOptionsFormModel = getProductModel(shelves, providers);

    this.productFormGroup = this.formService.createFormGroup(this.productOptionsFormModel);
    this.formConversionArray = this.productFormGroup.get('conversions') as FormArray;
    this.formConversionModel = this.formService.findById('conversions', this.productOptionsFormModel) as DynamicFormArrayModel;
    this.productFormGroup.get('name').setValue(articleName);
  }

  async onSubmitProduct(): Promise<void> {
    if (this.productFormGroup.valid && !await this.existProduct(this.productFormGroup.get('name').value)) {
      const product: Product = {
        name: this.productFormGroup.get('name').value,
        provider: this.productFormGroup.get('provider').value,
        shelf: this.productFormGroup.get('shelf').value,
        conversions: this.productFormGroup.get('conversions').value || [],
        used: undefined,
        image: null,
      };
      await this.productsService.create(product);
      this.toaster.showToaster('Le produit a bien été créé');
      this.productFormGroup = null;
      this.dialogRef.close({ product: true });
    } else {
      this.toaster.showToaster('ERREUR: Un produit avec le même nom existe déjà');
    }
  }

  public addConversionLine(): void {
    this.formService.addFormArrayGroup(this.formConversionArray, this.formConversionModel);
  }

  public removeItem(context: DynamicFormArrayModel, index: number): void {
    this.formService.removeFormArrayGroup(index, this.formConversionArray, context);
  }

  async existProduct(productName: string): Promise<boolean> {
    return this.products.some(product => product.name === productName);
  }

  private optionMapFilter(valueField: string, labelfield?: string) {
    return (arr) => {
      if (labelfield) {
        return arr.map(b => ({
          value: b[valueField],
          label: b[labelfield],
        }));
      } else {
        return arr.map(b => ({
          value: b[valueField],
          label: b[valueField],
        }));
      }
    };
  }


  public async changeFilterValue(event): Promise<void> {
    this.productsService.list({
      search: event.target.value,
    }).then((res) => {
      this.productOptions.next(this.optionMapFilter('name')(res.rows));
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRemoveEvent(): void {
    this.dialogRef.close({
      removed: true,
    });
  }

  onEditArticle(): void {
    this.dialogRef.close({
      article: {
        date: this.articleFormGroup.get('date').value,
        name: this.articleFormGroup.get('product').value,
        quantity: this.articleFormGroup.get('quantity').value,
      },
    });
  }
}
