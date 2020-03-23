import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MediaObserver } from '@angular/flex-layout';
import { debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { Member } from '../member.model';
import { MoleculerDataSource } from '../../shared/utils/moleculer-data-source';
import { MembersOptions, MembersService } from '../members.service';
import { ToasterService } from '../../core/services/toaster.service';
import { CURRENT_SCHOOL_YEAR } from '../../constants';
import { RegisterMemberDialogComponent } from '../../shared/dialogs/register-member/register-member-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['lastName', 'firstName', 'school', 'updatedAt', 'actions'];
  dataSource: MoleculerDataSource<Member, MembersOptions>;

  // Filters
  selectedStatus = '';

  totalRegistered = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(private membersService: MembersService,
    private toasterService: ToasterService,
    private mediaObserver: MediaObserver,
    private ngxPermissionsService: NgxPermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    if (this.mediaObserver.isActive('sm') || this.mediaObserver.isActive('xs')) {
      this.displayedColumns = ['lastName', 'firstName', 'actions'];
    }

    this.dataSource = new MoleculerDataSource<Member, MembersOptions>(this.membersService);

    // Load state from query params
    this.route.queryParams.pipe(first())
      .subscribe((value) => {
        this.paginator.pageSize = +value['pageSize'];
        this.paginator.pageIndex = +value['page'] - 1;

        const [, direction, sort] = /^(-)?(\w+)$/.exec(value['sort'] || '') || [undefined, '-', 'updatedAt'];
        this.sort.direction = direction ? 'desc' : 'asc';
        this.sort.active = sort;

        this.searchInput.nativeElement.value = value['search'] || '';

        if (value['active'] === 'true') {
          this.selectedStatus = 'active';
        } else if (value['inactive'] === 'true') {
          this.selectedStatus = 'inactive';
        } else {
          this.selectedStatus = '';
        }
      });

    // Load and save initial count as number of registered members
    await this.loadMembersPage({ skipRouteQueryParams: true });
    this.totalRegistered = this.dataSource.total;
  }

  ngAfterViewInit(): void {
    // Server-side search
    const search = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.paginator.pageIndex = 0),
    );

    // Reset the paginator after sorting
    const sort = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));

    // Merge everything to reload members
    merge(search, sort, this.paginator.page, this.membersService.refresh$).subscribe(() => this.loadMembersPage());
  }

  async loadMembersPage({ skipRouteQueryParams }: { skipRouteQueryParams?: boolean } = {}): Promise<void> {
    const options = {
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.searchInput.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
      active: this.selectedStatus === 'active',
      inactive: this.selectedStatus === 'inactive',
    };

    await this.dataSource.load(options);

    if (!skipRouteQueryParams) {
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: options,
        queryParamsHandling: 'merge',
      });
    }

    // If initial settings, update totalRegistered
    if (!options.search && options.active) this.totalRegistered = this.dataSource.total;
  }

  isRegistered(member: Member): boolean {
    return !!member.registrations.find(r => r.year === CURRENT_SCHOOL_YEAR);
  }

  async register(member: Member): Promise<void> {
    const dialogRef = this.dialog.open(RegisterMemberDialogComponent, {
      width: '350px',
      data: member,
      disableClose: true,
    });

    const newSchool = await dialogRef.afterClosed().toPromise();
    if (!newSchool) return;

    await this.membersService.register(member._id, newSchool);
    this.toasterService.showToaster(`Adhérent inscrit pour l'année ${CURRENT_SCHOOL_YEAR}`);
  }

  hideTotal(): boolean {
    return !this.ngxPermissionsService.getPermission('members.count');
  }
}
