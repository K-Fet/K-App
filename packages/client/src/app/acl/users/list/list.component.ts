import { NgxPermissionsService } from 'ngx-permissions';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UsersOptions, UsersService } from '../../../core/api-services/users.service';
import { MoleculerDataSource } from '../../../shared/utils/moleculer-data-source';
import { AccountType, User } from '../../../shared/models';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html',
  styleUrls: [],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['email', 'description', 'action'];
  dataSource: MoleculerDataSource<User, UsersOptions>;

  // Filters
  selectedAccountType: AccountType = AccountType.BARMAN;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(private usersService: UsersService,
              private router: Router,
              private ngxPermissionService: NgxPermissionsService) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.ngxPermissionService.getPermissions()['users:write']) {
      this.displayedColumns = ['email', 'description'];
    }

    this.dataSource = new MoleculerDataSource<User, UsersOptions>(this.usersService);

    await this.dataSource.load({ accountType: this.selectedAccountType });

    // Refresh list on change
    this.usersService.refresh$.subscribe(() => this.loadUsersPage());
  }

  ngAfterViewInit(): void {
    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadUsersPage())).subscribe();
  }

  async loadUsersPage(): Promise<void> {
    const options = {
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
      accountType: this.selectedAccountType,
    };

    await this.dataSource.load(options);
  }

  edit(user: User): void {
    this.router.navigate(['/acl/users', user._id, 'edit']);
  }
}
