import { Component, OnInit } from '@angular/core';
import { Service, ServicesTemplate } from '../../../shared/models';
import { ServicesTemplatesService } from '../../../core/api-services/services-templates.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { templateDateToDate } from '../templates.helper';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  template: ServicesTemplate;
  services: Service[] = [];

  constructor(private templateService: ServicesTemplatesService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { template: ServicesTemplate }) => {
      this.template = data.template;
      this.changeFormatDate();
    });
  }

  changeFormatDate(): void {
    this.services = this.template.services.map(n => ({
      ...templateDateToDate(n),
      nbMax: n.nbMax,
    }));
  }

  async openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${this.template.name} ?`,
      },
    });

    const choice = await dialogRef.afterClosed().toPromise();
    if (choice) this.delete();
  }

  async delete() {
    await this.templateService.remove(this.template._id);
    this.toasterService.showToaster('Template supprimé');
    this.router.navigate(['/services/templates']);
  }
}
