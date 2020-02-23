import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormGroup } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ServiceService } from '../../core/api-services/service.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Service } from '../../shared/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function transformServiceToDate(date: Service): string {
  return `${format(date.startAt, 'EEEE d LLLL', { locale: fr })} de
            ${format(date.startAt, 'HH')}h à
            ${format(date.endAt, 'HH')}h`;
}

@Component({
  templateUrl: './services-list.component.html',
})
export class ServiceListComponent implements OnInit {

  displayedColumns = ['date', 'start', 'end', 'action'];
  servicesData: MatTableDataSource<Service>;
  searchFormGroup: FormGroup;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private serviceService: ServiceService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog,
              private ngxPermissionsService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionsService.getPermissions()['services.write']) {
      this.displayedColumns = ['date', 'start', 'end'];
    }
  }

  update(): void {
    this.serviceService.getWeek().subscribe(async (week) => {
      const { rows: services } = await this.serviceService.list({
        startAt: week.start,
        endAt: week.end,
        pageSize: 1000,
      });
      this.servicesData = new MatTableDataSource(services);
      this.servicesData.paginator = this.paginator;
      this.servicesData.sort = this.sort;
    });
  }

  edit(service: Service): void {
    this.router.navigate(['/services/services-manager/', service._id]);
  }

  async delete(service: Service): Promise<void> {
    await this.serviceService.remove(service._id);
    this.toasterService.showToaster('Service supprimé');
    this.update();
  }

  async openConfirmationDialog(service: Service): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation', message:
          `Confirmez-vous la suppression du service du ${transformServiceToDate(service)} ?`,
      },
    });

    const choice = await dialogRef.afterClosed().toPromise();
    if (choice) this.delete(service);
  }
}
