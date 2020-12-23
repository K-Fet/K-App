import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Article } from '../../article';
import { DynamicFormModel, DynamicSelectModel, DynamicInputModel, DynamicDatePickerModel, DynamicFormService, DynamicFormOptionConfig } from '@ng-dynamic-forms/core';
import { ProductsService } from 'src/app/inventory-management/api-services/products.service';
import { from, Subject } from 'rxjs';
import { subYears } from 'date-fns';
import { ProvidersService } from 'src/app/inventory-management/api-services/providers.service';
import { ShelvesService } from 'src/app/inventory-management/api-services/shelves.service';
import { Product } from 'src/app/inventory-management/products/product.model';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html',
  styleUrls: ['./edit-article-dialog.component.scss']
})
export class EditArticleDialogComponent implements OnInit {

  public articleFormGroup: FormGroup;
  public articleOptionsFormModel: DynamicFormModel;

  public productFormGroup: FormGroup;
  public productOptionsFormModel: DynamicFormModel;

  public productsPromise: Promise<Product[]>;
  public products: Product[] = [];

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
  
  addProduct(articleName: string): void{
    const optionMap = (valueField, labelfield) => arr => arr.map(b => ({
      value: b[valueField],
      label: b[labelfield],
    }));

    const providers = this.providersService.listAll();
    const shelves = this.shelvesService.listAll();

    this.productOptionsFormModel = [
      new DynamicInputModel({
        id: 'name',
        label: 'Name',
        value: articleName,
        validators: { required: null },
        inputType: 'string',
      }),
      new DynamicSelectModel<string>({
        id: 'provider',
        label: 'Fournisseur',
        validators: { required: null },
        options: from(providers.then(optionMap('_id','name')),
        ),
      }),
      new DynamicSelectModel<string>({
        id: 'shelf',
        label: 'Rayon',
        validators: { required: null },
        options: from(shelves.then(optionMap('_id','name')),
        ),
      }),
    ],

    this.productFormGroup = this.formService.createFormGroup(this.productOptionsFormModel);
  }

  async onSubmitProduct(): Promise<void> {  //TODO gérer les convertion car on envoie ça direct des factures/csv, et les factures fb sont compté en nb de kaisses et pas de bouteilles
    if(this.productFormGroup.valid && !await this.existProduct(this.productFormGroup.get('name').value)){
      const product: Product = {
        name: this.productFormGroup.get('name').value,
        provider: this.productFormGroup.get('provider').value,
        shelf: this.productFormGroup.get('shelf').value,
        conversions: [],
        used: undefined,
        image: null,
      }
      await this.productsService.create(product);
      this.toaster.showToaster('Le produit a bien été créé');
      this.productFormGroup = null;
      this.dialogRef.close({product: true});
    }
    else{
      this.toaster.showToaster('ERREUR: Un produit avec le même nom existe déjà');
    }
  }

  async existProduct(productName: string): Promise<boolean> {
    if(this.products.map(prod => prod.name).indexOf(productName)===-1){
      return false;
    } else {
      return true;
    }
  }

  private optionMapFilter(valueField: string, labelfield?: string) {
    return (arr) => 
    { 
      if(labelfield){
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
    }
  } 
  

  public async changeFilterValue(event): Promise<void> {
    this.productsService.list({
      search: event.target.value,
    }).then((res) => 
    {  
      console.log(this.optionMapFilter('name')(res.rows)); //laisser ce log
      this.productOptions.next(this.optionMapFilter('name')(res.rows));
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEditArticle(): void {
    this.dialogRef.close({
      article: {
        date: this.articleFormGroup.get('date').value,
        name: this.articleFormGroup.get('product').value,
        quantity: this.articleFormGroup.get('quantity').value,
      }
    })
  }
}
