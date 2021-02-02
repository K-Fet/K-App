import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProductsService } from '../../api-services/products.service';
import { Product } from '../../products/product.model';
import { StockEventsService } from '../../api-services/stock-events.service';
import { StockEvent } from '../../stock-events/stock-events.model';
import { Stock } from '../stock';
import { setHours } from 'date-fns';

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
  ) {
    this.instantStock = [];
    this.realStock = [];
    this.diffStock = [];
  }

  emitInstantStockSubject(): void {
    this.instantStockSubject.next(this.instantStock);
  }

  async setInstantStock(): Promise<void> {
    const events: StockEvent[] = await this.getRecentEvents(1000);
    this.instantStock = [];
    const productsInDb: Product[] = await this.productsService.listAll();
    const productIdInDb: string[] = productsInDb.map(product => product._id);
    this.instantStock = [];
    const productsId: string[] = [];

    events.map(event => {
      const index2: number = productsId.indexOf(event.product as string);
      if (index2 === -1) {
        productsId.push(event.product as string);
        const product: Product = productsInDb[productIdInDb.indexOf(event.product as string)];
        const diff: number = event.diff;
        this.instantStock.push({
          product,
          diff,
        });
      } else {
        this.instantStock[index2].diff += event.diff;
      }
    });

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
    const oldstock = this.realStock.find(sto => sto.product._id === stock.product._id);
    if (!oldstock) {
      this.realStock.push(stock);
    } else {
      oldstock.diff = stock.diff;
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
    this.realStock.map(stock => this.updateDiffFromReal(stock));
    this.instantStock.map(stock => {
      if (!this.diffStock.some(sto => sto.product._id === stock.product._id)) {
        this.diffStock.push({
          product: stock.product,
          diff: -stock.diff,
        });
      }
    });
    this.diffStock.sort(this.compareStock);
    this.emitDiffStockSubject();
  }

  updateDiffFromReal(stock: Stock): void {
    const instantStock = this.instantStock.find(sto => sto.product._id === stock.product._id);
    const diffStock = this.diffStock.find(sto => sto.product._id === stock.product._id);
    if (!instantStock) {
      if (!diffStock) {
        this.diffStock.push({
          product: stock.product,
          diff: stock.diff,
        });
      } else {
        diffStock.diff = stock.diff;
      }
    } else {
      if (!diffStock) {
        this.diffStock.push({
          product: stock.product,
          diff: stock.diff - instantStock.diff,
        });
      } else {
        diffStock.diff = stock.diff - instantStock.diff;
      }
    }
    this.diffStock.sort(this.compareStock);
  }

  private compareStock(a: Stock, b: Stock): number {
    if (a.product.name < b.product.name) return -1;
    else if (a.product.name > b.product.name) return 1;
    else return 0;
  }

  private async getRecentEvents(initPageSize: number): Promise<StockEvent[]> {
    let begin = false;
    let done = false;
    let events: StockEvent[] = [];
    const { totalPages, pageSize } = await this.stockEventsService.list({
      pageSize: initPageSize,
      page: 1,
      sort: '-date',
    });
    for (let page = 1; page < totalPages + 1; page += 1) {
      if (done) break;
      const { rows } = await this.stockEventsService.list({
        pageSize,
        page,
        sort: '-date',
      });
      const index = rows.findIndex(row => row.type === 'InventoryUpdate');
      if (index === -1 && !begin) {
        events = [...events, ...rows];
      } else if (index > -1 && !begin) {
        begin = true;
        events = [...events, ...rows.splice(0, index)];
        rows.map(row => {
          if (row.type === 'InventoryUpdate' && done === false) {
            events.push(row);
          } else {
            done = true;
          }
        });
      } else if (index === -1 && begin) break;
      else if (index > -1 && begin) {
        if (index === 0) {
          rows.map(row => {
            if (row.type === 'InventoryUpdate' && done === false) {
              events.push(row);
            } else {
              done = true;
            }
          });
        } else break;
      }
    }
    return events;
  }

  public async adjustStocks(date: Date): Promise<void> {
    const newDate = setHours(date, 14);

    await this.stockEventsService.add([
      ...this.instantStock.map<StockEvent>(stock => ({
        product: stock.product._id,
        diff: -stock.diff,
        date: date,
        type: 'InventoryAdjustment',
      })),
      ...this.realStock.map<StockEvent>(stock => ({
        product: stock.product._id,
        diff: stock.diff,
        date: newDate,
        type: 'InventoryUpdate',
      })),
    ]);
    this.setInstantStock();
  }
}
