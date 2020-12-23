import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Stock } from '../../stock';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent implements OnInit {


  @Input('stocksSubject')
  public stocksSubject: Subject<Stock[]>;

  public displayedColumns: string[] = ['name', 'quantity'];
  public dataSource: MatTableDataSource<Stock>;
  
  // constructor() { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    this.stocksSubject.subscribe(
      (stocks: Stock[]) => {
        this.dataSource = new MatTableDataSource(stocks);
        this.dataSource.paginator = this.paginator; 
      }
    );
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
