import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ShelvesService } from '../../api-services/shelves.service';
import { Shelf } from '../shelf.model';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { MoleculerDataSource } from '../../../shared/utils/moleculer-data-source';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'action'];
  dataSource: MoleculerDataSource<Shelf>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(private shelfService: ShelvesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource = new MoleculerDataSource<Shelf>(this.shelfService);
    this.dataSource.load();
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
    this.dataSource.load({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  view(shelf: Shelf): void {
    this.router.navigate(['/inventory-management/shelves', shelf._id]);
  }

  edit(shelf: Shelf): void {
    this.router.navigate(['/inventory-management/shelves', shelf._id, 'edit']);
  }
}
