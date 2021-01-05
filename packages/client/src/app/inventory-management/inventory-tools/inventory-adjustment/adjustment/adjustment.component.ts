import { Component, OnInit, Inject } from '@angular/core';
import { AdjustmentStockService } from '../../services/adjustment-stock.service';
import { Subscription, from } from 'rxjs';
import { Stock } from '../../stock';
import { InvoicesService } from '../../services/invoices.service';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicSelectModel, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { Product } from 'src/app/inventory-management/products/product.model';
import { ProductsService } from 'src/app/inventory-management/api-services/products.service';
import { ParseService } from '../../services/parse.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChooseProductDialogComponent } from '../choose-product-dialog/choose-product-dialog.component';


@Component({
  selector: 'validation-dialog',
  templateUrl: 'validation-dialog.html',
})
export class ValidationDialog {

  constructor(
    public dialogRef: MatDialogRef<ValidationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Date,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }

}


@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.scss']
})
export class AdjustmentComponent implements OnInit {

  public realStocks: Stock[];
  public csvfiles: File[];
  public filesSubscription: Subscription;

  public stocks: Stock[];
  public stocksSubscription: Subscription;
  
  public productsPromise: Promise<Product[]>;
  public products: Product[];

  public formGroup: FormGroup;

  public optionsFormModel: DynamicFormModel;

  public break = false;

  public detailedView = false;
  
  public date: Date;

  constructor( 
    public readonly adjustmentStockService: AdjustmentStockService,
    private invoiceService: InvoicesService,
    private readonly productsService: ProductsService,
    private readonly formService: DynamicFormService,
    private readonly parseService: ParseService,
    private readonly toaster: ToasterService,
    private readonly dialog: MatDialog,
  ) {
    const optionMap = (valueField, labelField) => arr => arr.map(b => ({
      value: b[valueField],
      label: b[labelField],
    }));

    

    this.productsPromise = this.productsService.listAll();
    

    this.optionsFormModel = [
      new DynamicSelectModel<string>({
        id: 'product',
        label: 'Produit',
        validators: { required: null },
        options: from(this.productsPromise.then(optionMap('_id', 'name')),
        ),
      }),
      new DynamicInputModel({
        id: 'diff',
        label: 'Quantité',
        validators: { required: null },
        inputType: 'number',
      })
    ];

    this.formGroup = this.formService.createFormGroup(this.optionsFormModel);

    this.adjustmentStockService.setDiffStock();
   }

  async ngOnInit(): Promise<void> {
    this.stocksSubscription = this.adjustmentStockService.instantStockSubject.subscribe(
      (stocks: Stock[]) => {
        this.stocks = stocks;
      }
    );
    this.adjustmentStockService.setInstantStock();

    this.adjustmentStockService.realStockSubject.subscribe(
      (stocks: Stock[]) => {
        this.realStocks = stocks;
      }
    );
    this.adjustmentStockService.emitRealStockSubject();

    this.filesSubscription = this.invoiceService.invoicesSubject.subscribe(
      (invoices: File[]) =>{
        this.csvfiles = invoices;
      }
    )
    this.invoiceService.removeAll();

    this.products = await this.productsPromise;
  }

  onDrop(e: any): void {
    e.preventDefault(); 
    const files: File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      const file: File = files[key];
      if(file.type === "text/csv"){
        this.invoiceService.addInvoice(file);
      }
    });
  }

  onNgSubmit(): void {
    if(this.formGroup.valid){
      const index = this.products.map(prod => prod._id).indexOf(this.formGroup.get('product').value);
      const product: Product = this.products[index];
      const stock = {
        product: product,
        diff: this.formGroup.get('diff').value,
      }
      this.adjustmentStockService.addRealStock(stock);
    }
  }

  onRemove(): void {
    this.invoiceService.removeInvoice();
  }

  async onSubmitDrop(): Promise<void> {
    let stocks: Stock[] = [];
    if(this.csvfiles.length === 1){
      await this.parseService.fromFilestoText(this.csvfiles);
      for(const art of this.parseService.articleSum){
        const index = this.products.map(pro => pro.name).indexOf(art[0]);
        if(index === -1){
          const dialogRef = this.dialog.open(ChooseProductDialogComponent, {
            data: {
              articleName: art[0],
              products: this.products,
            }
          });
          if(this.break){
            this.break = false;
            break;
          }
          dialogRef.afterClosed().subscribe((res) => {
            if(!res){
              stocks = [];
              this.toaster.showToaster(`Erreur: le produit ${art[0]} n'est pas en db`);
              this.break = true;
            }
            else {
              const index2 = this.products.map(pro => pro._id).indexOf(res.product);
              if(index2>-1){
                stocks.push({
                  product: this.products[index2],
                  diff: art[1]
                });
              } else {
                stocks = [];
                this.toaster.showToaster(`Une erreur est survenue`);
                this.break = true;
              }
            }
          })
          
        }
        else {
          stocks.push({
            product: this.products[index],
            diff: art[1]
          });
        }
      }
      this.adjustmentStockService.setRealStock(stocks);
    }
  }

  public async onAjusteLesStocks(): Promise<void>{
    const dialogRef = this.dialog.open(ValidationDialog, {
      data: this.date,
    });

    dialogRef.afterClosed().subscribe( (res) => {
      if(res){
        const date = new Date(this.date);
        date.setHours(13);
        this.adjustmentStockService.adjustStocks(date);
      }
    })
  }

  public changeDate(event): void{
    this.date = event.target.value;
  }

}