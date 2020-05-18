import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { StockEventsDataSource } from '../stock-events.data-source';
import { StockEventsService } from '../../api-services/stock-events.service';

import { StockEvent } from '../stock-events.model';
import { ListEventService } from '../services/list-event.service';



@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'product', 'diff', 'type'];
  dataSource: StockEventsDataSource;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor( private stockEventsService: StockEventsService,
               private listEventService: ListEventService) {}

  async ngOnInit() {
    this.dataSource = new StockEventsDataSource(this.stockEventsService);
    await this.dataSource.loadStockEvents();
    await this.listEventService.initProducts();
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadStockEventsPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadStockEventsPage())).subscribe();
  }

  async loadStockEventsPage(): Promise<void>  {
    await this.dataSource.loadStockEvents({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  renameType(stockEvent?: StockEvent): string {
    if(stockEvent === undefined) return "Event undefined";
    else{
      if(stockEvent.type === "InventoryAdjustment") return "Ajustement des stocks";
      else if(stockEvent.type === "Transaction") return "Vente";
      else if(stockEvent.type === "Delivery") return "Réception";
      else {
        return "Type undefined";
      }
    }
  }

}
