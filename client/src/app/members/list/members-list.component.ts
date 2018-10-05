import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MemberService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { CodeDialogComponent } from '../../dialogs/code-dialog/code-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { CURRENT_SCHOOL_YEAR } from '../../_helpers/currentYear';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit {

  displayedColumns = ['lastName', 'firstName', 'school', 'lastActive', 'action'];
  membersData: MatTableDataSource<Member>;

  deletedMember: Member;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private memberService: MemberService,
              private toasterService: ToasterService,
              private router: Router,
              public dialog: MatDialog,
              private ngxPermissionsService: NgxPermissionsService,
              public media: ObservableMedia,
  ) { }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionsService.getPermissions()['member:write']) {
      this.displayedColumns = ['lastName', 'firstName', 'lastActive', 'school'];
    }
    this.media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs' && this.displayedColumns.includes('school')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('school'), 1);
      } else if (!this.displayedColumns.includes('school')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('firstName') + 1, 0, 'school');
      }
    });
  }

  update(): void {
    this.memberService.getAll().subscribe((members) => {
      this.membersData = new MatTableDataSource(members);
      this.membersData.paginator = this.paginator;
      this.membersData.sort = this.sort;
    });
  }

  register(member: Member) {
    this.memberService.register(member.id).subscribe(({ year }) => {
      this.toasterService.showToaster(`Adhérent inscrit pour l'année ${year}-${year + 1}`);
      this.update();
    });
  }

  edit(member: Member): void {
    this.router.navigate(['/members', member.id]);
  }

  delete(member: Member, code: number): void {
    this.memberService.delete(member.id, code)
      .subscribe(() => {
        this.toasterService.showToaster('Adhérent supprimé');
        this.update();
      });
  }

  applyFilter(filterValue: string): void {
    this.membersData.filter = filterValue.trim().toLowerCase();
  }

  getLastActive(member: Member): string {
    // TODO: Enhance the display with badge maybe
    if (member.registrations && member.registrations.length > 0) {
      // Ordered from the last registration to the oldest
      const { year } = member.registrations[0];

      if (year === CURRENT_SCHOOL_YEAR) {
        return 'Actif';
      }
      return `Inactif depuis ${year}-${year + 1}`;
    }
    return 'Aucune activité';
  }

  openDeleteDialog(member: Member): void {
    this.deletedMember = member;
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: `Suppression de ${member.firstName} ${member.lastName}` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(this.deletedMember, result);
      }
    });
  }

  needRegistration(member: Member): boolean {
    return !(member.registrations
      && member.registrations.length > 0
      && member.registrations[0].year === CURRENT_SCHOOL_YEAR);

  }

  openRegisterDialog(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: `Inscription de ${member.firstName} ${member.lastName} ` +
          `pour l'année ${CURRENT_SCHOOL_YEAR}-${CURRENT_SCHOOL_YEAR + 1} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.register(member);
    });
  }
}
