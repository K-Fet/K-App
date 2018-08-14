import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SpecialAccount } from '../../_models';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SpecialAccountService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { CodeDialogComponent } from '../../dialogs/code-dialog/code-dialog.component';

@Component({
  templateUrl: './special-accounts-list.component.html',
  styleUrls: ['./special-accounts-list.component.scss'],
})
export class SpecialAccountListComponent implements OnInit {

  displayedColumns = ['username', 'description', 'action'];
  specialAccountData: MatTableDataSource<SpecialAccount>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private specialAccountService: SpecialAccountService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog,
              private ngxPermissionService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionService.getPermissions()['specialaccount:write']) {
      this.displayedColumns = ['username', 'description'];
    }
  }

  update(): void {
    this.specialAccountService.getAll().subscribe((specialAccounts) => {
      this.specialAccountData = new MatTableDataSource(specialAccounts);
      this.specialAccountData.paginator = this.paginator;
      this.specialAccountData.sort = this.sort;
    });
  }

  edit(specialAccount: SpecialAccount): void {
    this.router.navigate(['/specialaccounts', specialAccount.id]);
  }

  delete(specialAccount: SpecialAccount, code: number): void {

    this.specialAccountService.delete(specialAccount.id, code)
      .subscribe(() => {
        this.toasterService.showToaster('Compte spécial supprimé');
        this.update();
      });
  }

  openDialog(specialAccount: SpecialAccount): void {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: `Suppression du compte special: ${specialAccount.connection.username}` },
    });

    dialogRef.afterClosed().subscribe((code) => {
      if (code) {
        this.delete(specialAccount, code);
      }
    });
  }
}
