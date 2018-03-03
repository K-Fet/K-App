import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService, ServiceService, DEFAULT_WEEK_SWITCH } from '../../_services/index';
import { Template, Service } from '../../_models/index';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
    selector: 'app-open-services',
    templateUrl: './open-services.component.html'
})

export class OpenServicesComponent implements OnInit {

    templates: Template[] = new Array<Template>();
    services: Service[] = new Array<Service>();
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

    addServiceForm(categoryId: Number, nbMax: Number, startAt: Moment, endAt: Moment) {
        const serviceFormGroup = this.formBuilder.group({
            nbMaxFormControl: [nbMax, Validators.required],
            startAtFormControl: [startAt ? startAt.toDate() : '', Validators.required],
            endAtFormControl: [endAt ? endAt.toDate() : '', Validators.required]
        });
        serviceFormGroup.valueChanges.subscribe(val => {
            this.sortServiceForm();
        });
        this.servicesFormArray.push(serviceFormGroup);
    }

    sortServiceForm() {
        this.servicesFormArray.controls.sort((a, b) => {
            const aStartAt = (<FormGroup>a).controls.startAtFormControl.value;
            const bStartAt = (<FormGroup>b).controls.startAtFormControl.value;
            if (aStartAt < bStartAt) {
                return -1;
            } else if (aStartAt > bStartAt) {
                return 1;
            }
            return 0;
        });
    }

    removeServiceForm(fromGroupId: Number) {
        this.servicesFormArray.removeAt(+fromGroupId);
    }

    getControls() {
        return (<FormArray>this.generalFormArray.get([1])).controls;
    }

    getFirstServiceDate(): Date {
        if (this.servicesFormArray.controls.length > 0) {
            return (<FormGroup>this.servicesFormArray.controls[0]).controls.startAtFormControl.value;
        } else {
            return null;
        }
    }

    getLastServiceDate(): Date {
        if (this.servicesFormArray.controls.length > 0) {
            const lastIndex = this.servicesFormArray.controls.length - 1;
            return (<FormGroup>this.servicesFormArray.controls[lastIndex]).controls.startAtFormControl.value;
        } else {
            return null;
        }
    }

    ngOnInit(): void {
        // Get templates
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
                (<Template>val.templateSelectorFormControl).services.forEach(service => {
                    let startAt: Moment;
                    let endAt: Moment;
                    if (moment().weekday() >= DEFAULT_WEEK_SWITCH && service.startAt.day === DEFAULT_WEEK_SWITCH) {
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
            this.sortServiceForm();
        });
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
            startAt: controls.startAtFormControl.value,
            endAt: controls.endAtFormControl.value,
            nbMax: controls.nbMaxFormControl.value,
        };
    }
}
