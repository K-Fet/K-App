import { Injectable } from '@angular/core';
import { StockEventsService } from '../../api-services/stock-events.service';
import { Product } from '../../products/product.model';
import { StockEvent } from '../../stock-events/stock-events.model';
import { ToasterService } from 'src/app/core/services/toaster.service';

export interface ProductStockManagement {
  product: string | Product;
  deliveryQuantity?: number;
  lastMonthStock?: number;
  realInstantStock?: number;
  theoreticalStocks?: number;
  theoreticalSales?: number;
  realSales?: number;
  difference?: number;
  diffSalesPercentage?: number;
  diffStocksPercentage?: number;
}

@Injectable()
export class StocksManagementService {
  
  public stocksManagement: ProductStockManagement[];
  constructor(
    private readonly stockEventsService: StockEventsService,
    private readonly toaster: ToasterService,
  ) { }

  public async getLastStockManagement(date?: Date): Promise<{endDate: Date; stocks: ProductStockManagement[]; beginDate: Date}> {
    const stockEvents = await this.getLastEvents(date);
    let endDate: Date;
    let beginDate: Date;
    if(stockEvents && stockEvents[0]) endDate = new Date(stockEvents[0].date);
    if(stockEvents && stockEvents[0]) beginDate = new Date (stockEvents[stockEvents.length-1].date);
    if(stockEvents){
      this.stocksManagement = this.setLastMonthStock(stockEvents);
      this.setRealInstantStock(stockEvents);
      this.setDeliveryQuantity(stockEvents);
      this.setTheoreticalStocks(stockEvents);
      this.setTheoreticalSales(stockEvents);
      this.setRealSales();
      this.setDifference();
      this.setSalesPercentage();
      this.setStocksPercentage();
      return {endDate: endDate, stocks: this.stocksManagement, beginDate: beginDate};
    }
    return {endDate: null, stocks: null, beginDate: null};
  }

  private async getLastEvents(date?: Date): Promise<StockEvent[]> {
    let beginFirst = false;
    let finishFirst = false;
    let beginLast = false;
    let finishLast = false;
    const events: StockEvent[] = [];
    const pageSize = 100;
    const {totalPages} = await  this.stockEventsService.list({ pageSize: pageSize, sort: '-date' });
    let pageIndex = 1;
    let beginIndex = null;

    let done = false;

    if(date){
      for(let index = 1; index <= totalPages; index ++){
        if(done) break;
        const {rows} = await  this.stockEventsService.list({ page: index,  pageSize: pageSize, sort: '-date' });
        for(const i in rows){
          if(new Date(rows[i].date)<=new Date(date)){
            pageIndex = index;
            beginIndex = +i;
            done = true;
            break;
          }
        }
      }
    }

    for(pageIndex; pageIndex<=totalPages; pageIndex ++){
      if(finishLast) break;
      const {rows} = await  this.stockEventsService.list({ page: pageIndex,  pageSize: pageSize, sort: '-date' });
      if(beginIndex){
        rows.splice(0, beginIndex);
        beginIndex = null;
      }
      let index = rows.map(row => row.type).indexOf('InventoryUpdate');
      if(index > -1 || beginFirst){
        if(index === -1 || beginFirst) index = 0;
        beginFirst = true;
        for(let i = index; i<rows.length; i+=1){
          if(rows[i].type !== 'InventoryUpdate' && beginFirst){
            finishFirst = true;
          }
          if(rows[i].type === 'InventoryUpdate' && finishFirst){
            beginLast = true;
          }
          if(rows[i].type !== 'InventoryUpdate' && beginLast){
            finishLast = true;
            break;
          }
          events.push(rows[i]);
        }
      }
    }
    if(events.map(event => event.type).indexOf('InventoryAdjustment') === -1){
      this.toaster.showToaster('Aucune gestion de stock n\'a été fait');
      return null;
    }
    return events;
  }

  private setLastMonthStock(stockEvents: StockEvent[]): ProductStockManagement[] {
    const res = [];
    for(let index = stockEvents.length-1; index>0; index = index -1){
      if(stockEvents[index].type !== "InventoryUpdate"){
        break;
      } else {
        res.push({
          product: stockEvents[index].product,
          lastMonthStock: stockEvents[index].diff
        });
      }
    }
    return res;
  }

  private setRealInstantStock(stockEvents: StockEvent[]): void {
    for(const event of stockEvents) {
      if(event.type !== "InventoryUpdate"){
        break;
      } else {
        const index = this.stocksManagement.map(stock => stock.product as string).indexOf(event.product as string);
        if(index > -1){
          this.stocksManagement[index].realInstantStock = event.diff;
        } else {
          this.stocksManagement.push({
            product: event.product,
            lastMonthStock: 0,
            realInstantStock: event.diff,
          })
        }
      }
    }
  }

  private setDeliveryQuantity(stockEvents: StockEvent[]): void {
    for(const event of stockEvents) {
      if(event.type === 'Delivery'){
        const index = this.stocksManagement.map(stock => stock.product as string).indexOf(event.product as string);
        if(index > -1){
          if(this.stocksManagement[index].deliveryQuantity){
            this.stocksManagement[index].deliveryQuantity += event.diff;
          }
          else{
            this.stocksManagement[index].deliveryQuantity = event.diff;
          }
        } 
        // else {       PEUT ETRE UTILE SI ON FAIT GESTION DE STOCK SUR TOUT CE QU'IL Y A DANS LES FACTURES FB (GAZ, PALLETTES, ...)
        //   this.stocksManagement.push({
        //     product: event.product,
        //     lastMonthStock: 0,
        //     realInstantStock: 0,
        //     deliveryQuantity: event.diff,
        //   })
        // }
      }
    }
    for(const a of this.stocksManagement){
      if(!a.deliveryQuantity) a.deliveryQuantity = 0;
    }
  }

  private setTheoreticalStocks(stockEvents: StockEvent[]): void {
    for(const event of stockEvents){
      if(event.type === 'InventoryAdjustment'){
        const index = this.stocksManagement.map(stock => stock.product as string).indexOf(event.product as string);
        if(index > -1){
          this.stocksManagement[index].theoreticalStocks = -event.diff;
        }
      }
    }
    for(const a of this.stocksManagement){
      if(!a.theoreticalStocks) a.theoreticalStocks = 0;
    }
  }

  private setTheoreticalSales(stockEvents: StockEvent[]): void {
    for(const event of stockEvents){
      if(event.type === 'Transaction'){
        const index = this.stocksManagement.map(stock => stock.product as string).indexOf(event.product as string);
        if(index > -1){
          this.stocksManagement[index].theoreticalSales = event.diff;
        }
      }
    }
    for(const a of this.stocksManagement){
      if(!a.theoreticalSales) a.theoreticalSales = 0;
    }
  }

  private setDifference(): void {
    for(const a of this.stocksManagement){
      a.difference = a.realInstantStock - a.theoreticalStocks;
    }
  }

  private setRealSales(): void {
    for(const a of this.stocksManagement){
      a.realSales =- (a.lastMonthStock + a.deliveryQuantity - a.realInstantStock);
    }
  }

  private setSalesPercentage(): void {
    for(const a of this.stocksManagement){
      a.diffSalesPercentage = a.difference/a.theoreticalSales*100;
    }
  }

  private setStocksPercentage(): void {
    for(const a of this.stocksManagement){
      a.diffStocksPercentage = - a.difference/(a.lastMonthStock+a.deliveryQuantity)*100;
    }
  }
}