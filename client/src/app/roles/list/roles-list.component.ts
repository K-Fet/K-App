import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from '../../_models';
import { RoleService, ToasterService } from '../../_services';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
    templateUrl: './roles-list.component.html',
    styleUrls: ['./roles-list.component.scss'],
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
                private ngxPermissionsService: NgxPermissionsService,
                public media: ObservableMedia) {
    }

    ngOnInit(): void {
        this.update();
        if (!this.ngxPermissionsService.getPermissions()['role:write']) {
            this.displayedColumns = ['name', 'description'];
        }
        this.media.subscribe((change: MediaChange) => {
            if ((change.mqAlias === 'sm' || change.mqAlias === 'xs') && this.displayedColumns.includes('description')) {
                this.displayedColumns.splice(this.displayedColumns.indexOf('description'), 1);
            } else if (!this.displayedColumns.includes('description') && change.mqAlias !== 'xs' && change.mqAlias !== 'sm') {
                this.displayedColumns.splice(this.displayedColumns.indexOf('name') + 1, 0, 'description');
            }
        });
    }

    update(): void {
        this.roleService.getAll().subscribe(roles => {
            this.rolesData = new MatTableDataSource(roles);
            this.rolesData.paginator = this.paginator;
            this.rolesData.sort = this.sort;
        });
    }

    edit(role: Role): void {
        this.router.navigate(['/roles', role.id]);
    }

    delete(role: Role): void {
        this.roleService.delete(role.id)
        .subscribe(() => {
            this.toasterService.showToaster('Role supprimé');
            this.update();
        });
    }

    applyFilter(filterValue: string): void {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.rolesData.filter = filterValue;
    }

    openConfirmationDialog(role: Role): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: { title: 'Confirmation', message: `Confirmez-vous la suppression de ${role.name} ?` },
        });

        dialogRef.afterClosed().subscribe(choice => {
            if (choice) {
                this.delete(role);
            }
        });
    }
}
