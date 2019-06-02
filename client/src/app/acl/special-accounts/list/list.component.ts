import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SpecialAccount } from '../../../shared/models';
import { SpecialAccountService } from '../special-account.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { CodeDialogComponent } from '../../../shared/dialogs/code-dialog/code-dialog.component';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['email', 'description', 'action'];
  specialAccountData: MatTableDataSource<SpecialAccount>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private specialAccountService: SpecialAccountService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog,
              private ngxPermissionService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionService.getPermissions()['specialaccount:write']) {
      this.displayedColumns = ['email', 'description'];
    }
  }

  async update() {
    const specialAccounts = await this.specialAccountService.getAll();

    this.specialAccountData = new MatTableDataSource(specialAccounts);
    this.specialAccountData.paginator = this.paginator;
    this.specialAccountData.sort = this.sort;
  }

  edit(specialAccount: SpecialAccount): void {
    this.router.navigate(['/acl/special-accounts', specialAccount.id, 'edit']);
  }

  async delete(specialAccount: SpecialAccount, code: number) {
    await this.specialAccountService.delete(specialAccount.id, code);
    this.toasterService.showToaster('Compte spécial supprimé');
    this.update();
  }

  async openDialog(specialAccount: SpecialAccount) {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: `Suppression du compte special: ${specialAccount.connection.email}` },
    });

    const code = await dialogRef.afterClosed().toPromise();
    if (code) this.delete(specialAccount, code);
  }
}
