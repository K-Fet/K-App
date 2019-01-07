import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProvidersService } from '../../api-services/providers.service';
import { Provider } from '../provider.model';
import { ProvidersDataSource } from '../providers.data-source';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'action'];
  dataSource: ProvidersDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private providerService: ProvidersService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource = new ProvidersDataSource(this.providerService);
    this.dataSource.loadProviders();
  }

  ngAfterViewInit(): void {
    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadProvidersPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadProvidersPage())).subscribe();
  }

  loadProvidersPage() {
    this.dataSource.loadProviders({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  edit(provider: Provider): void {
    this.router.navigate(['/inventory-management/providers', provider._id, 'edit']);
  }

  view(provider: Provider): void {
    this.router.navigate(['/inventory-management/providers', provider._id]);
  }
}
