import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, TemplateService } from '../../_services/index';
import { Template, Service } from '../../_models/index';

@Component({
  templateUrl: './templates-new.component.html'
})

export class TemplateNewComponent implements OnInit {

    template: Template = new Template();
    services: Array<Service>;
    serviceForm: FormGroup;
    templateForm: FormGroup;
    formArray: FormArray;
    selectedDay: Number;

    WEEK_DAY = [
        {id: '1', value: 'Lundi'},
        {id: '2', value: 'Mardi'},
        {id: '3', value: 'Mercredi'},
        {id: '4', value: 'Jeudi'},
        {id: '5', value: 'Vendredi'},
        {id: '6', value: 'Samedi'},
        {id: '7', value: 'Dimanche'} ];

    constructor(
        private templateService: TemplateService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.serviceForm = this.fb.group({
            name: new FormControl('', [Validators.required]),   // à passer dans le templateForm plus tard
            start: new FormControl('', [Validators.required]),
            end: new FormControl('', [Validators.required]),
            day: new FormControl('', [Validators.required])
        });
      /*  this.templateForm = this.fb.group({
            name: new FormControl('', [Validators.required])
        });
        */
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



    addService() {}
}
