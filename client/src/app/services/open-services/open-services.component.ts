import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService, ServiceService, DEFAULT_WEEK, CategoryService } from '../../_services/index';
import { Template, Service, Category } from '../../_models/index';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
    selector: 'app-open-services',
    templateUrl: './open-services.component.html'
})

export class OpenServicesComponent implements OnInit {

    templates: Template[] = new Array<Template>();
    categories: Category[] = new Array<Category>();
    selectedTemplate: Template;

    templateSelectorFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;

    constructor (private templateService: TemplateService,
        private toasterService: ToasterService,
        private serviceService: ServiceService,
        private categoryService: CategoryService,
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

    addServiceForm(categoryId: Number, nbMax: Number, startAt: Moment, endAt: Moment) {
        const serviceFormGroup = this.formBuilder.group({
            nbMaxFormControl: [nbMax, Validators.required],
            categoryFormControl: [categoryId, Validators.required],
            startAtFormControl: [startAt ? startAt.toDate() : '', Validators.required],
            endAtFormControl: [endAt ? endAt.toDate() : '', Validators.required]
        });
        this.servicesFormArray.push(serviceFormGroup);
    }

    removeServiceForm(fromGroupId: Number) {
        this.servicesFormArray.removeAt(+fromGroupId);
    }

    getControls() {
        return (<FormArray>this.generalFormArray.get([1])).controls;
    }

    ngOnInit(): void {
        // Get templates
        this.templateService.getAll().subscribe(templates => {
            this.templates = templates;
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
        this.onFormChanges();

        // Get categories
        this.categoryService.getAll().subscribe(categories => {
            this.categories = categories;
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    onFormChanges() {
        this.templateSelectorFormGroup.valueChanges.subscribe(val => {
            if (val.templateSelectorFormControl) {
                (<Template>val.templateSelectorFormControl).services.forEach(service => {
                    let startAt: Moment;
                    let endAt: Moment;
                    if (moment().weekday() >= DEFAULT_WEEK.start) {
                        startAt = moment().add(1, 'week').weekday(+service.startAt.day);
                        endAt = moment().add(1, 'week').weekday(+service.endAt.day);
                    } else {
                        startAt = moment().weekday(+service.startAt.day);
                        endAt = moment().weekday(+service.endAt.day);
                    }
                    startAt.set({
                        'hour': +service.startAt.hour,
                        'minute': +service.startAt.minute,
                        'second': 0,
                        'millisecond': 0
                    });
                    endAt.set({
                        'hour': +service.endAt.hour,
                        'minute': +service.endAt.minute,
                        'second': 0,
                        'millisecond': 0
                    });
                    this.addServiceForm(service.categoryId, service.nbMax, startAt, endAt);
                });
            }
        });
    }

    getCategoryNameByFormId(categoryId: Number): String {
        const category = this.categories.filter(cat => {
            return cat.id === categoryId;
        })[0];
        return category.name;
    }

    createServices() {
        const services: Service[] = this.servicesFormArray.controls.map(formGroup => {
            return this.prepareService((<FormGroup>formGroup).controls);
        });
        this.serviceService.create(services).subscribe(() => {
            this.toasterService.showToaster('Nouveaux services enregistrés', 'Fermer');
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    prepareService(controls): Service {
        return {
            categoryId: controls.categoryFormControl.value,
            startAt: controls.startAtFormControl.value,
            endAt: controls.endAtFormControl.value,
            nbMax: controls.nbMaxFormControl.value,
        };
    }
}
