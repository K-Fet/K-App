import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Template, Service } from '../../_models';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
    templateUrl: './template-view.component.html',
})

export class TemplateViewComponent implements OnInit {

    template: Template = new Template;
    services: Service[] = new Array<Service>();



    constructor(
        private templateService: TemplateService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.template.id = params['id'];
            this.templateService.getById(+this.template.id).subscribe(template => {
                this.template = template;
                this.changeFormatDate();
            });

        });
    }

    toDate(val) {
        const date = new Date();
        date.setDate(val.day);
        date.setHours(val.hours);
        date.setMinutes(val.minutes);
        return date;
    }

    changeFormatDate() {
        this.services = this.template.services.map(n =>
        new Service({
            startAt: this.toDate(n.startAt),
            endAt: this.toDate(n.endAt),
            nbMax: n.nbMax
        }));

    }

    openConfirmationDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: { title: 'Confirmation', message: 'Confirmez-vous la suppression de ' + this.template.name + ' ?'}
        });

        dialogRef.afterClosed().subscribe(choice => {
            if (choice) {
                this.delete();
            }
        });
    }

    delete() {
        this.templateService.delete(this.template.id).subscribe(() => {
            this.toasterService.showToaster('Template supprimé');
            this.router.navigate(['templates']);
        });
    }
}
