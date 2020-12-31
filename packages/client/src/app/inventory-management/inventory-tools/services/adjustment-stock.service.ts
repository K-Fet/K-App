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

    public realStockSubject = new Subject<Stock[]>();
    public realStock: Stock[];

    public diffStockSubject = new Subject<Stock[]>();
    public diffStock: Stock[];
 
    constructor(
        private readonly productsService: ProductsService,
        private readonly stockEventsService: StockEventsService,
    )
    {
      this.instantStock = [];
      this.realStock = [];
      this.diffStock = [];
    }

    emitInstantStockSubject(): void {
        this.instantStockSubject.next(this.instantStock);
    }

    async setInstantStock(): Promise<void> {
      const events: StockEvent[] = await this.getRecentEvents(100);
      this.instantStock = [];
      const productsInDb: Product[] = await this.productsService.listAll();
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
      this.setDiffStock();
    }

    emitRealStockSubject(): void {
      this.realStockSubject.next(this.realStock);
    }
    
    setRealStock(stocks: Stock[]): void {
      this.realStock = stocks;
      this.realStock.sort(this.compareStock);
      this.emitRealStockSubject();
      this.setDiffStock();
    }

    addRealStock(stock: Stock): void {
      const index = this.realStock.map(sto => sto.product._id).indexOf(stock.product._id);
      if(index === -1){
        this.realStock.push(stock);
      } else {
        this.realStock[index].diff = stock.diff;
      }
      this.realStock.sort(this.compareStock);
      this.emitRealStockSubject();
      this.updateDiffFromReal(stock);
      this.emitDiffStockSubject();
    }

    emitDiffStockSubject(): void {
      this.diffStockSubject.next(this.diffStock);
    }

    setDiffStock(): void {
      this.diffStock = [];
      for(const stock of this.realStock){
        this.updateDiffFromReal(stock);
      }
      for(const stock of this.instantStock) {
        const index = this.diffStock.map(sto => sto.product._id).indexOf(stock.product._id);
        if(index === -1){
          this.diffStock.push({
            product: stock.product,
            diff: -stock.diff,
          });
        }
      }
      this.diffStock.sort(this.compareStock);
      this.emitDiffStockSubject();
    }

    updateDiffFromReal(stock: Stock): void {
      const index = this.instantStock.map(sto => sto.product._id).indexOf(stock.product._id);
      const diffIndex = this.diffStock.map(sto => sto.product._id).indexOf(stock.product._id);
      if(index === -1){
        if(diffIndex === -1){
          this.diffStock.push({
            product: stock.product,
            diff: stock.diff,
          });
          console.log('oui');
        } else {
          this.diffStock[index].diff = stock.diff;
        }
      } else {
        if(diffIndex === -1){
          this.diffStock.push({
            product: stock.product,
            diff: stock.diff - this.instantStock[index].diff,
          });
        } else {
          this.diffStock[index].diff = stock.diff - this.instantStock[index].diff;
        }
      }
      this.diffStock.sort(this.compareStock);
    }

    private compareStock(a: Stock, b: Stock): number {
        if(a.product.name < b.product.name) return -1;
        else if(a.product.name > b.product.name) return 1;
        else return 0;
    }

    private async getRecentEvents(initPageSize: number): Promise<StockEvent[]>{
      let begin = false;
      let done = false;
      let events: StockEvent[] = [];
      const { totalPages, pageSize } = await this.stockEventsService.list({
        pageSize: initPageSize,
        page: 1,
        sort: '-date',
      });
      for(let page=1; page<totalPages+1; page+=1){
        if(done) break;
        const { rows } = await this.stockEventsService.list({
          pageSize: pageSize,
          page: page,
          sort: '-date',
        });
        const index = rows.map(row => row.type).indexOf('InventoryUpdate');
        if(index ===-1 && !begin){
          events = [ ...events, ...rows];
        }
        else if(index > -1 && !begin){
          begin = true;
          events = [ ...events, ...rows.splice(0, index)];
          for(const row of rows){
            if(row.type === 'InventoryUpdate'){
              events.push(row);
            }
            else {
              done = true;
              break;
            }
          }
        }
        else if (index === -1 && begin) break;
        else if (index > -1  && begin) {
          if(index === 0) {
            for(const row of rows){
              if(row.type === 'InventoryUpdate'){
                events.push(row);
              }
              else {
                done = true;
                break;
              }
            }
          } else break;
        }
      }
      return events;
    }

    public async adjustStocks(date: Date): Promise<void> {
      for(const stock of this.instantStock){
        const stockEvent: StockEvent = {
          product: stock.product._id,
          diff: -stock.diff,
          date: date,
          type: 'InventoryAdjustment'
        };
        this.stockEventsService.create(stockEvent);
      }
      date.setHours(14);
      for(const stock of this.realStock){
        const stockEvent: StockEvent = {
          product: stock.product._id,
          diff: stock.diff,
          date: date,
          type: 'InventoryUpdate'
        };
        this.stockEventsService.create(stockEvent);
      }
      this.setInstantStock();
    }
}