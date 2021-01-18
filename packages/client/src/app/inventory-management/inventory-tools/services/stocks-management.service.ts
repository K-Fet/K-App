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

    const dateInput = new Date(date);
    let done = false;

    if(date){
      for(let index = 1; index <= totalPages; index ++){
        if(done) break;
        const {rows} = await  this.stockEventsService.list({ page: index,  pageSize: pageSize, sort: '-date' });
        Object.keys(rows).forEach(key => { 
          if(new Date(rows[key].date) <= dateInput && !done){
            pageIndex = index;
            beginIndex = +key;
            done = true;
          }
        });
      }
    }

    for(pageIndex; pageIndex<=totalPages; pageIndex ++){
      if(finishLast) break;
      const {rows} = await  this.stockEventsService.list({ page: pageIndex,  pageSize: pageSize, sort: '-date' });
      if(beginIndex){
        rows.splice(0, beginIndex);
        beginIndex = null;
      }
      const firstrow = rows.find(row => row.type === 'InventoryUpdate');
      if(firstrow || beginFirst){
        rows.some(row => {
          if(!finishLast && (firstrow === row || beginFirst)){
            beginFirst = true; 
            if(row.type !== 'InventoryUpdate' && !finishFirst){
              finishFirst = true;
            }
            if(row.type === 'InventoryUpdate' && finishFirst && !beginLast){
              beginLast = true;
            }
            if(row.type !== 'InventoryUpdate' && beginLast){
              finishLast = true;
              return true;
            }
            events.push(row);
          }
        });
      }
    }
    if(!events.some(event => event.type === 'InventoryAdjustment')){
      this.toaster.showToaster('Aucune gestion de stock n\'a été fait');
      return null;
    }
    return events;
  }

  private setLastMonthStock(stockEvents: StockEvent[]): ProductStockManagement[] {
    const reversed = [...stockEvents].reverse();
    const res = [];
    reversed.some(evt => {
      if(evt.type !== "InventoryUpdate"){
        return true;
      } else {
        res.push({
          product: evt.product,
          lastMonthStock: evt.diff
        });
      }
    });
    return res;
  }

  private setRealInstantStock(stockEvents: StockEvent[]): void {
    stockEvents.some( (event) => {
      if(event.type !== "InventoryUpdate"){
        return true;
      } else {
        const stock = this.stocksManagement.find(stock => stock.product as string === event.product as string);
        if(stock){
          stock.realInstantStock = event.diff;
        } else {
          this.stocksManagement.push({
            product: event.product,
            lastMonthStock: 0,
            realInstantStock: event.diff,
          })
        }
      }
    });
    this.stocksManagement.map(a => {
      if(!a.realInstantStock) a.realInstantStock = 0;
    });
  }

  private setDeliveryQuantity(stockEvents: StockEvent[]): void {
    stockEvents.map(event => {
      if(event.type === 'Delivery'){
        const stock = this.stocksManagement.find(stock => stock.product as string === event.product as string);
        if(stock){
          if(stock.deliveryQuantity){
            stock.deliveryQuantity += event.diff;
          }
          else{
            stock.deliveryQuantity = event.diff;
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
    });
    this.stocksManagement.map( a=> {
      if(!a.deliveryQuantity) a.deliveryQuantity = 0;
    });
  }

  private setTheoreticalStocks(stockEvents: StockEvent[]): void {
    stockEvents.map(event => {
      if(event.type === 'InventoryAdjustment'){
        const stock = this.stocksManagement.find(stock => stock.product as string === event.product as string);
        if(stock){
          stock.theoreticalStocks = -event.diff;
        }
      }
    });
    this.stocksManagement.map( a => {
      if(!a.theoreticalStocks) a.theoreticalStocks = 0;
    });
  }

  private setTheoreticalSales(stockEvents: StockEvent[]): void {
    stockEvents.map(event => {
      if(event.type === 'Transaction'){
        const stock = this.stocksManagement.find(stock => stock.product as string === event.product as string);
        if(stock){
          stock.theoreticalSales = event.diff;
        }
      }
    });
    this.stocksManagement.map(a => {
      if(!a.theoreticalSales) a.theoreticalSales = 0;
    });
  }

  private setDifference(): void {
    this.stocksManagement.map(a => {
      a.difference = a.realInstantStock - a.theoreticalStocks;
    });
  }

  private setRealSales(): void {
    this.stocksManagement.map(a => {
      a.realSales =- (a.lastMonthStock + a.deliveryQuantity - a.realInstantStock);
    });
  }

  private setSalesPercentage(): void {
    this.stocksManagement.map(a => {
      a.diffSalesPercentage = a.difference/a.theoreticalSales*100;
    });
  }

  private setStocksPercentage(): void {
    this.stocksManagement.map(a => {
      a.diffStocksPercentage = - a.difference/(a.lastMonthStock+a.deliveryQuantity)*100;
    });
  }

  private setCost(stocks: ProductStockManagement[]): ProductStockManagement[] {
    stocks.map( stock => {
      if((stock.product as Product).price){
        stock.cost = ((stock.product as Product).price*stock.difference).toString();
      }
      else {
        stock.cost = 'Non Défini';
      }
    });
    return stocks;
  }

  private bindProductOnId(stocks: ProductStockManagement[]): ProductStockManagement[]{
    if(stocks){
      stocks.map(sto => {
        const stock = this.products.find(prod => prod._id === sto.product as string); 
        if(stock){
          sto.product = stock;
        }
      });
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
    stocks.map(a => {
      csvContent += `${(a.product as Product).name}, ${a.deliveryQuantity}, ${a.lastMonthStock}, ${a.realInstantStock}, ${a.theoreticalStocks}, ${a.theoreticalSales}, ${a.realSales}, ${a.difference}, ${a.diffSalesPercentage}, ${a.diffStocksPercentage}, ${a.cost} \r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stokFet${date.toString()}.csv`);
    document.body.appendChild(link); // Required for FF
    
    link.click();
  }
}