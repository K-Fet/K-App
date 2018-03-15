import { Component, OnInit, ViewChild } from '@angular/core';
import { Kommission } from '../../_models';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { KommissionService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  templateUrl: './kommissions-list.component.html',
  styleUrls: ['./kommissions-list.component.scss']
})
export class KommissionsListComponent implements OnInit {

    displayedColumns = ['name', 'description', 'action'];
    kommissionsData: MatTableDataSource<Kommission>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private kommissionService: KommissionService,
        private toasterService: ToasterService,
        private router: Router,
        private dialog: MatDialog,
        private ngxPermissionsService: NgxPermissionsService) {
    }

    ngOnInit() {
        this.update();
        if (!this.ngxPermissionsService.getPermissions()['kommission:write']) {
            this.displayedColumns = ['name', 'description'];
        }
    }

    update() {
        this.kommissionService.getAll().subscribe(kommissions => {
            this.kommissionsData = new MatTableDataSource(kommissions);
            this.kommissionsData.paginator = this.paginator;
            this.kommissionsData.sort = this.sort;
        });
    }

    edit(kommission: Kommission) {
        this.router.navigate(['/kommissions', kommission.id]);
    }

    delete(kommission: Kommission) {
        this.kommissionService.delete(kommission.id)
        .subscribe(() => {
            this.toasterService.showToaster('Kommission supprimée', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    openConfirmationDialog(kommission: Kommission): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: { title: 'Confirmation', message: 'Confirmez-vous la suppression de ' + kommission.name + ' ?'}
        });

        dialogRef.afterClosed().subscribe(choice => {
            if (choice) {
                this.delete(kommission);
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.kommissionsData.filter = filterValue;
    }
}
