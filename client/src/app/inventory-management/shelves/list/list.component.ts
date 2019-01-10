import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ShelvesService } from '../../api-services/shelves.service';
import { Shelf } from '../shelf.model';
import { ShelvesDataSource } from '../shelves.data-source';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'action'];
  dataSource: ShelvesDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private shelfService: ShelvesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource = new ShelvesDataSource(this.shelfService);
    this.dataSource.loadShelves();
  }

  ngAfterViewInit(): void {
    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadShelvesPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadShelvesPage())).subscribe();
  }

  loadShelvesPage() {
    this.dataSource.loadShelves({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  edit(shelf: Shelf): void {
    this.router.navigate(['/inventory-management/shelves', shelf._id, 'edit']);
  }
}
