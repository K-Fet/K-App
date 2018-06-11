import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, Template } from '../../_models';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';

@Component({
  templateUrl: './template-view.component.html',
})

export class TemplateViewComponent implements OnInit {

  template: Template = new Template();
  services: Service[] = [];

  constructor(
    private templateService: TemplateService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.template.id = params['id'];
      this.templateService.getById(+this.template.id).subscribe((template) => {
        this.template = template;
        this.changeFormatDate();
      });

    });
  }

  toDate(val): Date {
    return moment().isoWeekday(val.day).set({
      hour: val.hours,
      minute: val.minutes,
    }).toDate();
  }

  changeFormatDate(): void {
    this.services = this.template.services.map(n =>
      new Service({
        startAt: this.toDate(n.startAt),
        endAt: this.toDate(n.endAt),
        nbMax: n.nbMax,
      }));

  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${this.template.name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((choice) => {
      if (choice) {
        this.delete();
      }
    });
  }

  delete(): void {
    this.templateService.delete(this.template.id).subscribe(() => {
      this.toasterService.showToaster('Template supprimé');
      this.router.navigate(['templates']);
    });
  }
}
