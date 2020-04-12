import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AdditionalServicesOptions, ServicesService } from '../../core/api-services/services.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Service } from '../../shared/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoleculerDataSource } from '../../shared/utils/moleculer-data-source';
import { MoleculerDataLoader } from '../../shared/utils/moleculer-data-loader';

function transformServiceToDate(date: Service): string {
  return `${format(date.startAt, 'EEEE d LLLL', { locale: fr })} de
            ${format(date.startAt, 'HH')}h à
            ${format(date.endAt, 'HH')}h`;
}

@Component({
  templateUrl: './list.component.html',
})
export class ServiceListComponent implements OnInit {

  displayedColumns = ['date', 'start', 'end', 'action'];
  dataSource: MoleculerDataSource<Service, AdditionalServicesOptions>;
  dataLoader: MoleculerDataLoader<Service, AdditionalServicesOptions>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private servicesService: ServicesService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ngxPermissionsService: NgxPermissionsService) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.ngxPermissionsService.getPermissions()['services.write']) {
      this.displayedColumns = ['date', 'start', 'end'];
    }

    this.dataSource = new MoleculerDataSource<Service, AdditionalServicesOptions>(this.servicesService);
    this.dataLoader = new MoleculerDataLoader<Service, AdditionalServicesOptions>(
      this.router,
      this.route,
      this.dataSource,
      this.paginator,
      this.sort,
      {
        refresh: this.servicesService.refresh$,
        // TODO Load week from query param
        addQueryOptions: async (options) => {
          const { end, start } = await this.servicesService.$week.toPromise();
          return ({
            ...options,
            startAt: start,
            endAt: end,
          });
        },
      },
    );

    await this.dataLoader.init();
  }

  edit(service: Service): void {
    this.router.navigate(['/services/services-manager/', service._id]);
  }

  async delete(service: Service): Promise<void> {
    await this.servicesService.remove(service._id);
    this.toasterService.showToaster('Service supprimé');
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
