import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, TemplateService } from '../../_services/index';
import { Template } from '../../_models/index';

@Component({
  templateUrl: './templates-new.component.html'
})

export class TemplateNewComponent implements OnInit {

    template: Template = new Template();

    templateForm: FormGroup;

    constructor(
        private templateService: TemplateService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.templateForm = this.fb.group({
            name: new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): void {

    }
/*
    add() {
        this.templateService.create(this.template).subscribe(() => {
            this.toasterService.showToaster('Template créé');
            this.router.navigate(['/templates'] );
        });
    }
    */
}
