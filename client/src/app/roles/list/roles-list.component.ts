import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from '../../_models';
import { RoleService, ToasterService } from '../../_services';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import {ConfirmationDialogComponent} from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

    displayedColumns = ['name', 'description', 'action'];
    rolesData: MatTableDataSource<Role>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private roleService: RoleService,
        private toasterService: ToasterService,
        private router: Router,
        private dialog: MatDialog,
        private ngxPermissionsService: NgxPermissionsService) {
    }

    ngOnInit() {
        this.update();
        if (!this.ngxPermissionsService.getPermissions()['specialaccount:write']) {
            this.displayedColumns = ['name', 'description'];
        }
    }

    update() {
        this.roleService.getAll().subscribe(roles => {
            this.rolesData = new MatTableDataSource(roles);
            this.rolesData.paginator = this.paginator;
            this.rolesData.sort = this.sort;
        });
    }

    edit(role: Role) {
        this.router.navigate(['/roles', role.id]);
    }

    delete(role: Role) {
        this.roleService.delete(role.id)
        .subscribe(() => {
            this.toasterService.showToaster('Role supprimé');
            this.update();
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.rolesData.filter = filterValue;
    }

    openConfirmationDialog(role: Role): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: { title: 'Confirmation', message: 'Confirmez-vous la suppression de ' + role.name + ' ?'}
        });

        dialogRef.afterClosed().subscribe(choice => {
            if (choice) {
                this.delete(role);
            }
        });
    }
}
