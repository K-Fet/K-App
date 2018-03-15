import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SpecialAccount } from '../../_models';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ToasterService, SpecialAccountService } from '../../_services';
import { Router } from '@angular/router';
import {CodeDialogComponent} from '../../dialogs/code-dialog/code-dialog.component';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    templateUrl: './special-accounts-list.component.html',
    styleUrls: ['./special-accounts-list.component.scss']
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

    ngOnInit() {
        this.update();
        if (!this.ngxPermissionService.getPermissions()['specialaccount:write']) {
            this.displayedColumns = ['username', 'description'];
        }
    }

    update() {
        this.specialAccountService.getAll().subscribe(specialAccounts => {
            this.specialAccountData = new MatTableDataSource(specialAccounts);
            this.specialAccountData.paginator = this.paginator;
            this.specialAccountData.sort = this.sort;
        });
    }

    edit(specialAccount: SpecialAccount) {
        this.router.navigate(['/specialaccounts', specialAccount.id]);
    }

    delete(specialAccount: SpecialAccount, code: Number) {

        this.specialAccountService.delete(specialAccount.id, code)
        .subscribe(() => {
            this.toasterService.showToaster('Compte spécial supprimé', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    openDialog(specialAccount: SpecialAccount): void {
        const dialogRef = this.dialog.open(CodeDialogComponent, {
            width: '350px',
            data: { message: 'Suppression du compte special: ' + specialAccount.connection.username }
        });

        dialogRef.afterClosed().subscribe(code => {
            if (code) {
                this.delete(specialAccount, code);
            }
        });
    }
}
