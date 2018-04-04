import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../_models';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
    templateUrl: './template-view.component.html',
})

export class TemplateViewComponent implements OnInit {

    template: Template = new Template;

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
            });
        });
    }
}
