import { Component, OnInit } from '@angular/core';
import { TemplateService, ToasterService, ServiceService, DEFAULT_WEEK_SWITCH } from '../../_services/index';
import { Template, Service } from '../../_models/index';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Moment } from 'moment';
import { Router } from '@angular/router';

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
        private formBuilder: FormBuilder,
        private router: Router) {
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

    addServiceForm(nbMax: Number, startAt: Moment, endAt: Moment) {
        const serviceFormGroup = this.formBuilder.group({
            nbMaxFormControl: [nbMax, Validators.required],
            startAtFormControl: [startAt ? startAt.toDate() : '', Validators.required],
            endAtFormControl: [endAt ? endAt.toDate() : '', Validators.required]
        });
        serviceFormGroup.valueChanges.subscribe(() => {
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
        this.templateService.getAll().subscribe(template => {
            this.templates = [
                template
            ];
        });
        this.onFormChanges();
    }

    onFormChanges() {
        this.templateSelectorFormGroup.valueChanges.subscribe(val => {
            if (val.templateSelectorFormControl) {
                (<Template>val.templateSelectorFormControl).services.forEach(service => {
                    const startAt: Moment = moment().isoWeekday(+service.startAt.day).set({
                        'hour': +service.startAt.hours,
                        'minute': +service.startAt.minutes,
                        'second': 0,
                        'millisecond': 0
                    });
                    const endAt: Moment = moment().isoWeekday(+service.endAt.day).set({
                        'hour': +service.endAt.hours,
                        'minute': +service.endAt.minutes,
                        'second': 0,
                        'millisecond': 0
                    });
                    const firstDayOfNextWeek = this.getFirstDayOfNextWeek();
                    while (startAt.isBefore(firstDayOfNextWeek)) {
                        startAt.add(1, 'week');
                        endAt.add(1, 'week');
                    }
                    this.addServiceForm(service.nbMax, startAt, endAt);
                });
            }
            this.sortServiceForm();
        });
    }

    getFirstDayOfNextWeek(): Moment {
        const firstDay = moment().set({
            'hour': 0,
            'minute': 0,
            'second': 0,
            'millisecond': 0
        });
        if (moment().isoWeekday() <= DEFAULT_WEEK_SWITCH) {
            firstDay.isoWeekday(+DEFAULT_WEEK_SWITCH + 1);
        } else {
            firstDay.isoWeekday(+DEFAULT_WEEK_SWITCH + 1).add(1, 'week');
        }
        return firstDay;
    }

    createServices() {
        const services: Service[] = this.servicesFormArray.controls.map(formGroup => {
            return this.prepareService((<FormGroup>formGroup).controls);
        });
        this.serviceService.create(services).subscribe(() => {
            this.toasterService.showToaster('Nouveaux services enregistrés');
            this.router.navigate(['/dashboard']);
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
