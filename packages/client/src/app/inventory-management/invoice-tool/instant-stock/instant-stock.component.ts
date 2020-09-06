import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../products/product.model';
import { StockEvent } from '../../stock-events/stock-events.model';
import { StockEventsService } from '../../api-services/stock-events.service';
import { ProductsService } from '../../api-services/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


export interface Stock{
  product: Product;
  diff: number;
} 

@Component({
  selector: 'app-instant-stock',
  templateUrl: './instant-stock.component.html',
  styleUrls: ['./instant-stock.component.scss']
})
export class InstantStockComponent implements OnInit{

  public stocks: Stock[];

  public displayedColumns: string[] = ['name', 'quantity'];
  public dataSource: MatTableDataSource<Stock>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly stockEventsService: StockEventsService,
    private readonly productsService: ProductsService
  ) {}

  async ngOnInit(): Promise<void>{
    const total: number = (await this.stockEventsService.list()).total;
    const events: StockEvent[] =  (await this.stockEventsService.list({pageSize: total})).rows;
    await this.setUpStocks(events);
    this.dataSource = new MatTableDataSource<Stock>(this.stocks)
    this.dataSource.paginator = this.paginator;
  }

  private async setUpStocks(events): Promise<void> {
    this.stocks = [];
    const productsId: string[] = [];
    for(const index in events){
      const index2: number = productsId.indexOf(events[index].product);
      if(index2===-1){
        productsId.push(events[index].product);
        const product: Product = await this.productsService.get(events[index].product);
        const diff: number = events[index].diff;
        this.stocks.push({
          product,
          diff
        });
      }
      else{
        this.stocks[index2].diff += events[index].diff;
      }
    }
    this.stocks.sort(this.compareStock);
  }

  public applyFilter(event: Event): void {
    this.dataSource.filterPredicate = (data:Stock, filterValue: string) =>
      data.product.name.trim().toLowerCase().indexOf(filterValue) !== -1;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private compareStock(a: Stock, b: Stock): number {
    if(a.product.name < b.product.name) return -1;
    else if(a.product.name > b.product.name) return 1;
    else return 0;
  }

}
