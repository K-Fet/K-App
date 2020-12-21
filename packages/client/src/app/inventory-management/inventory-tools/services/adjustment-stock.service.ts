import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProductsService } from '../../api-services/products.service';
import { Product } from '../../products/product.model';
import { StockEventsService } from '../../api-services/stock-events.service';
import { StockEvent } from '../../stock-events/stock-events.model';
import { Stock } from '../stock';

@Injectable()
export class AdjustmentStockService {

    public instantStockSubject = new Subject<Stock[]>();
    public instantStock: Stock[];

    constructor(
        private readonly productsService: ProductsService,
        private readonly stockEventsService: StockEventsService,
    )
    {
      this.instantStock = [];
    }

    emitInstantStockSubject(): void {
        this.instantStockSubject.next(this.instantStock);
    }

    async setInstantStock(): Promise<void> {
      const total: number = (await this.stockEventsService.list()).total;
      const events: StockEvent[] =  (await this.stockEventsService.list({pageSize: total})).rows;
      
      this.instantStock = [];
      const totalProduct: number = (await this.productsService.list()).total;
      const productsInDb: Product[] = (await this.productsService.list({pageSize: totalProduct})).rows;
      const productIdInDb: string[] = productsInDb.map(product => product._id);
      this.instantStock = [];
      const productsId: string[] = [];
      for(const index in events){
        const index2: number = productsId.indexOf(events[index].product as string);
        if(index2===-1){
          productsId.push(events[index].product as string);
          const product: Product = productsInDb[productIdInDb.indexOf(events[index].product as string)]; 
          const diff: number = events[index].diff; 
          this.instantStock.push({
            product,
            diff
          });
        }
        else{
          this.instantStock[index2].diff += events[index].diff;
        }
      }
      this.instantStock.sort(this.compareStock);
      this.emitInstantStockSubject();
    }

    private compareStock(a: Stock, b: Stock): number {
        if(a.product.name < b.product.name) return -1;
        else if(a.product.name > b.product.name) return 1;
        else return 0;
      }
}