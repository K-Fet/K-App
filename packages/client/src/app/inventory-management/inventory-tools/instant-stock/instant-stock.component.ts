import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Stock } from '../stock';
import { Subscription } from 'rxjs';
import { AdjustmentStockService } from '../services/adjustment-stock.service';

@Component({
  selector: 'app-instant-stock',
  templateUrl: './instant-stock.component.html',
  styleUrls: ['./instant-stock.component.scss']
})
export class InstantStockComponent implements OnInit{

  public stocks: Stock[];
  public stocksSubscription: Subscription;

  public displayedColumns: string[] = ['name', 'quantity'];
  public dataSource: MatTableDataSource<Stock>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly adjustmentStockService: AdjustmentStockService,
  ) {}

  async ngOnInit(): Promise<void>{
    this.stocksSubscription = this.adjustmentStockService.instantStockSubject.subscribe(
      (stocks: Stock[]) => {
        this.stocks = stocks;
        this.dataSource = new MatTableDataSource<Stock>(this.stocks)
        this.dataSource.paginator = this.paginator;
      }
    );
    this.adjustmentStockService.setInstantStock();
  }

  public applyFilter(event: Event): void {
    this.dataSource.filterPredicate = (data: Stock, filterValue: string): boolean =>
      data.product.name.trim().toLowerCase().indexOf(filterValue) !== -1;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
