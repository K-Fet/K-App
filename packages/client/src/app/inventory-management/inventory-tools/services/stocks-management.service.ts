import { Injectable } from '@angular/core';
import { StockEventsService } from '../../api-services/stock-events.service';
import { Product } from '../../products/product.model';
import { StockEvent } from '../../stock-events/stock-events.model';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { ProductsService } from '../../api-services/products.service';

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
  cost?: string;
}

@Injectable()
export class StocksManagementService {
  
  public stocksManagement: ProductStockManagement[];
  public products: Product[];
  public productsPromise: Promise<Product[]>

  constructor(
    private readonly stockEventsService: StockEventsService,
    private readonly toaster: ToasterService,
    private readonly productsService: ProductsService
  ) { 
    this.productsPromise = this.productsService.listAll(); 
  }

  public async getLastStockManagement(date?: Date): Promise<{endDate: Date; stocks: ProductStockManagement[]; beginDate: Date}> {
    this.products = await this.productsPromise;
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
      this.stocksManagement = this.bindProductOnId(this.stocksManagement);
      this.stocksManagement = this.setCost(this.stocksManagement);
      this.stocksManagement.sort(this.sortTable);
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
      let index = rows.findIndex(row => row.type === 'InventoryUpdate');
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
    if(!events.some(event => event.type === 'InventoryAdjustment')){
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
        const index = this.stocksManagement.findIndex(stock => stock.product as string === event.product as string);
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
    for(const a of this.stocksManagement){
      if(!a.realInstantStock) a.realInstantStock = 0;
    }
  }

  private setDeliveryQuantity(stockEvents: StockEvent[]): void {
    for(const event of stockEvents) {
      if(event.type === 'Delivery'){
        const index = this.stocksManagement.findIndex(stock => stock.product as string === event.product as string);
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
        const index = this.stocksManagement.findIndex(stock => stock.product as string === event.product as string);
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
        const index = this.stocksManagement.findIndex(stock => stock.product as string === event.product as string);
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

  private setCost(stocks: ProductStockManagement[]): ProductStockManagement[] {
    for (const index in stocks){
      if((stocks[index].product as Product).price){
        stocks[index].cost = ((stocks[index].product as Product).price*stocks[index].difference).toString();
      }
      else {
        stocks[index].cost = 'Non Défini';
      }
    }
    return stocks;
  }

  private bindProductOnId(stocks: ProductStockManagement[]): ProductStockManagement[]{
    if(stocks){
      for(const sto of stocks) {
        const index = this.products.map(prod => prod._id).indexOf(sto.product as string);
        if(index>-1){
          sto.product = this.products[index];
        }
      }
      return stocks;
    }
    return null;
  }

  private sortTable(a: ProductStockManagement, b: ProductStockManagement): number{
    if((a.product as Product).provider !== (b.product as Product).provider){
      if((a.product as Product).provider > (b.product as Product).provider){
        return 1;
      }
      else return -1;
    } else {
      if((a.product as Product).shelf !== (b.product as Product).shelf){
        if((a.product as Product).shelf > (b.product as Product).shelf){
          return 1;
        }
        else return -1;
      } else {
        if((a.product as Product).name > (b.product as Product).name){
          return 1;
        } else return -1;
      }
    }
  }

  public onDownloadCsv(date: Date, stocks: ProductStockManagement[]): void {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += 'Produit, Quantité Livrée, Stock Mois Dernier, Stock Réel, Stock Théorique, Ventes Théoriques, Ventes Réelles, Difference, Pourcentage Pertes (ventes), Pourcentage Pertes (stocks), Coût des pertes \r\n';
    for (const a of stocks){
      csvContent += `${(a.product as Product).name}, ${a.deliveryQuantity}, ${a.lastMonthStock}, ${a.realInstantStock}, ${a.theoreticalStocks}, ${a.theoreticalSales}, ${a.realSales}, ${a.difference}, ${a.diffSalesPercentage}, ${a.diffStocksPercentage}, ${a.cost} \r\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stokFet${date.toString()}.csv`);
    document.body.appendChild(link); // Required for FF
    
    link.click();
  }
}