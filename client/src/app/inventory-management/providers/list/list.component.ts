import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProvidersService } from '../providers.service';
import { Provider } from '../provider.model';
import { ProvidersDataSource } from '../providers.data-source';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'action'];
  dataSource: ProvidersDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private providerService: ProvidersService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource = new ProvidersDataSource(this.providerService);
    this.dataSource.loadProviders();
  }

  ngAfterViewInit(): void {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadProvidersPage())).subscribe();
  }

  loadProvidersPage() {
    this.dataSource.loadProviders({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      sort: `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  edit(provider: Provider): void {
    this.router.navigate(['/inventory-management/providers', provider._id, 'edit']);
  }

  view(provider: Provider): void {
    this.router.navigate(['/inventory-management/providers', provider._id]);
  }
}
