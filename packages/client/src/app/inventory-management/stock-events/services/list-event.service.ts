import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { StockEvent } from '../stock-events.model';
import { ProductsService }from '../../api-services/products.service';
import { MoleculerListOptions } from 'src/app/shared/models/MoleculerWrapper';
import { Product } from '../../products/product.model';

@Injectable()

export class ListEventService {

  BASE_MOLECULERLISTOPTIONS = {} as MoleculerListOptions;

  productsSubject = new Subject<Product[]>();
  products: Product[];


  constructor( private productsService: ProductsService )
  {
    this.products = [];
  }

  emitArticleSubject(): void {
    this.productsSubject.next(this.products.slice());
  }

  async initProducts(): Promise<void> {
    this.products = await this.productsService.listAll();
  }

  getProductName(stockEvent: StockEvent): string{
    for(let i = 0; i<this.products.length; i++){
      if(stockEvent.product as string === this.products[i]._id) return this.products[i].name;
    }
    return 'undefined';
  }
}