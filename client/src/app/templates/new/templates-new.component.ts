import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, TemplateService } from '../../_services/index';
import { Template } from '../../_models/index';

const WEEK_DAY: Array<String> = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

@Component({
  templateUrl: './templates-new.component.html'
})

export class TemplateNewComponent implements OnInit {

    template: Template = new Template();
    startAt: string;
    endAt: string;
    templateForm: FormGroup;
    selectedDay: Number;

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
            name: new FormControl('', [Validators.required]),
            start: new FormControl('', [Validators.required]),
            end: new FormControl('', [Validators.required]),
            day: new FormControl('', [Validators.required])
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
