import { NgxPermissionsService } from 'ngx-permissions';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdditionalUsersOptions, UsersService } from '../../../core/api-services/users.service';
import { MoleculerDataSource } from '../../../shared/utils/moleculer-data-source';
import { AccountType, User } from '../../../shared/models';
import { MoleculerDataLoader } from '../../../shared/utils/moleculer-data-loader';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
  styleUrls: [],
})
export class ListComponent implements OnInit {

  dataSource: MoleculerDataSource<User, AdditionalUsersOptions>;
  dataLoader: MoleculerDataLoader<User, AdditionalUsersOptions>;

  // Filters
  selectedAccountType: AccountType;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxPermissionService: NgxPermissionsService) {
  }

  async ngOnInit(): Promise<void> {
    this.dataSource = new MoleculerDataSource<User, AdditionalUsersOptions>(this.usersService);
    this.dataLoader = new MoleculerDataLoader<User, AdditionalUsersOptions>(
      this.router,
      this.route,
      this.dataSource,
      this.paginator,
      this.sort,
      {
        searchInput: this.input,
        refresh: this.usersService.refresh$,
        addQueryOptions: options => ({ ...options, accountType: this.selectedAccountType }),
        loadFromQuery: (params): void => {
          this.selectedAccountType = params['accountType'] || AccountType.BARMAN;
        },
      },
    );
    await this.dataLoader.init();
  }

  getColumns(): string[] {
    const canWrite = this.ngxPermissionService.getPermissions()['users.write'];
    switch (this.selectedAccountType) {
      case AccountType.SERVICE:
        return ['email', 'description', 'updatedAt', canWrite && 'action'];
      case AccountType.BARMAN:
        return ['nickName', 'firstName', 'lastName', 'updatedAt', canWrite && 'action'];
    }
    return [];
  }

  has(name: string): boolean {
    return this.getColumns().includes(name);
  }
}
