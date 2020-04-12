import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MediaObserver } from '@angular/flex-layout';
import { Member } from '../member.model';
import { MoleculerDataSource } from '../../shared/utils/moleculer-data-source';
import { AdditionalMembersOptions, MembersService } from '../members.service';
import { ToasterService } from '../../core/services/toaster.service';
import { CURRENT_SCHOOL_YEAR } from '../../constants';
import { RegisterMemberDialogComponent } from '../../shared/dialogs/register-member/register-member-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivatedRoute, Router } from '@angular/router';
import { MoleculerDataLoader } from '../../shared/utils/moleculer-data-loader';

@Component({
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  displayedColumns = ['lastName', 'firstName', 'school', 'updatedAt', 'actions'];
  dataSource: MoleculerDataSource<Member, AdditionalMembersOptions>;
  dataLoader: MoleculerDataLoader<Member, AdditionalMembersOptions>;

  // Filters
  selectedStatus = '';

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

    this.dataSource = new MoleculerDataSource<Member, AdditionalMembersOptions>(this.membersService);
    this.dataLoader = new MoleculerDataLoader<Member, AdditionalMembersOptions>(
      this.router,
      this.route,
      this.dataSource,
      this.paginator,
      this.sort,
      {
        searchInput: this.searchInput,
        refresh: this.membersService.refresh$,
        loadFromQuery: (params): void => {
          if (params['active'] === 'true') {
            this.selectedStatus = 'active';
          } else if (params['inactive'] === 'true') {
            this.selectedStatus = 'inactive';
          } else {
            this.selectedStatus = '';
          }
        },
        addQueryOptions: options => ({
          ...options,
          active: this.selectedStatus === 'active',
          inactive: this.selectedStatus === 'inactive',
        }),
      },
    );

    await this.dataLoader.init();
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
