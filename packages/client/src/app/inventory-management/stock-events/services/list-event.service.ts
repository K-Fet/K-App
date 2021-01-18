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
    const product = this.products.find( product => stockEvent.product as string === product._id);
    if(product) return product.name;
    else return 'undefined';
  }
}