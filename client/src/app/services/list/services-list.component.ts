import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../../_models';
import { ServiceService, ToasterService } from '../../_services';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss'],
})
export class ServiceListComponent implements OnInit {

    displayedColumns = ['date', 'start', 'end', 'action'];
    servicesData: MatTableDataSource<Service>;
    searchFormGroup: FormGroup;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private serviceService: ServiceService,
                private toasterService: ToasterService,
                private router: Router,
                private dialog: MatDialog,
                private ngxPermissionsService: NgxPermissionsService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.update();
        if (!this.ngxPermissionsService.getPermissions()['service:write']) {
            this.displayedColumns = ['date', 'start', 'end'];
        }
        this.searchFormGroup = this.formBuilder.group({
            search: new FormControl(''),
        });
        this.searchFormGroup.valueChanges.subscribe(value => {
            value = value.trim(); // Remove whitespace
            value = value.toLowerCase(); // Datasource defaults to lowercase matches
            this.servicesData.filter = value;
            console.log('Yes');
        });
    }

    update(): void {
        this.serviceService.getWeek().subscribe(week => {
            this.serviceService.get(week.start, week.end).subscribe(services => {
                this.servicesData = new MatTableDataSource(services);
                this.servicesData.paginator = this.paginator;
                this.servicesData.sort = this.sort;
            });
        });
    }

    edit(service: Service): void {
        this.router.navigate(['/services', service.id, 'edit']);
    }

    delete(service: Service): void {
        this.serviceService.delete(service.id)
        .subscribe(() => {
            this.toasterService.showToaster('Service supprimé');
            this.update();
        });
    }

    openConfirmationDialog(service: Service): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: { title: 'Confirmation', message: `Confirmez-vous la suppression du service suivant ? ${service.startAt} ?` },
        });

        dialogRef.afterClosed().subscribe(choice => {
            if (choice) {
                this.delete(service);
            }
        });
    }
}
