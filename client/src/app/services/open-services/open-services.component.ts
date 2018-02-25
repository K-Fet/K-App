import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService, ServiceService } from '../../_services/index';
import { Template, Service } from '../../_models/index';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-open-services',
    templateUrl: './open-services.component.html'
})

export class OpenServicesComponent implements OnInit {

    templates: Template[] = new Array<Template>();
    selectedTemplate: Template;

    templateSelectorFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;

    constructor (private templateService: TemplateService,
        private toasterService: ToasterService,
        private serviceService: ServiceService,
        private formBuilder: FormBuilder) {
        this.createForms();
    }

    createForms() {
        this.templateSelectorFormGroup = this.formBuilder.group({
            templateSelectorFormControl: [''/*, Validators.required*/]
        });
        this.servicesFormArray = this.formBuilder.array([]);
        this.generalFormArray = this.formBuilder.array([
            this.templateSelectorFormGroup,
            this.servicesFormArray
        ]);
        this.generalFormGroup = this.formBuilder.group({
            generalFormArray: this.generalFormArray
        });
    }

    addServiceForm(nbMax: Number, startAt: Date, endAt: Date) {
        const serviceFormGroup = this.formBuilder.group({
            nbMaxFormControl: [nbMax, Validators.required],
            categoryFormControl: ['', Validators.required],
            startAtFormControl: [startAt, Validators.required],
            endAtFormControl: [endAt, Validators.required]
        });
        this.servicesFormArray.push(serviceFormGroup);
    }

    getControls() {
        return (<FormArray>this.generalFormArray.get([1])).controls;
    }

    ngOnInit(): void {
        this.templateService.getAll().subscribe(templates => {
            this.templates = templates;
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
        this.onFormChanges();
    }

    onFormChanges() {
        this.templateSelectorFormGroup.valueChanges.subscribe(val => {
            if (val.templateSelectorFormControl) {
                val.templateSelectorFormControl.services.forEach(service => {
                    const startAt = new Date();
                    const endAt = new Date();
                    this.addServiceForm(service.nbMax, startAt, endAt);
                });
            }
        });
    }
    createServices() {
        const services: Service[] = new Array<Service>();
        this.selectedTemplate.services.forEach(serviceTemplate => {
            services.push(this.prepareService(serviceTemplate));
        });
        this.serviceService.create(services).subscribe(() => {
            this.toasterService.showToaster('Nouveaux services enregistrés', 'Fermer');
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    prepareService(serviceTemplate): Service {
        const service = new Service();
        Object.keys(serviceTemplate).forEach(key => {
            service[key] = serviceTemplate[key];
        });
        return service;
    }
}
