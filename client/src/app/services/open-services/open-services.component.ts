import { Component, OnInit } from '@angular/core';
import { DEFAULT_WEEK_SWITCH, ServiceService, TemplateService, ToasterService } from '../../_services/index';
import { Service, Template } from '../../_models/index';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-open-services',
    templateUrl: './open-services.component.html'
})

export class OpenServicesComponent implements OnInit {

    templates: Array<Template> = new Array<Template>();
    services: Array<Service> = new Array<Service>();
    selectedTemplate: Template;

    templateSelectorFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;

    constructor(private templateService: TemplateService,
                private toasterService: ToasterService,
                private serviceService: ServiceService,
                private formBuilder: FormBuilder,
                private router: Router) {
        this.createForms();
    }

    createForms(): void {
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

    addServiceForm(nbMax: Number, startAt: moment.Moment, endAt: moment.Moment): void {
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

    sortServiceForm(): void {
        this.servicesFormArray.controls.sort((a, b) => {
            const aStartAt = (a as FormGroup).controls.startAtFormControl.value;
            const bStartAt = (b as FormGroup).controls.startAtFormControl.value;
            if (aStartAt < bStartAt)
                return -1;
            else if (aStartAt > bStartAt)
                return 1;

            return 0;
        });
    }

    removeServiceForm(fromGroupId: Number): void {
        this.servicesFormArray.removeAt(+fromGroupId);
    }

    getControls(): Array<AbstractControl> {
        return (this.generalFormArray.get([1]) as FormArray).controls;
    }

    getFirstServiceDate(): Date {
        if (this.servicesFormArray.controls.length > 0)
            return (this.servicesFormArray.controls[0] as FormGroup).controls.startAtFormControl.value;
        else
            return undefined;
    }

    getLastServiceDate(): Date {
        if (this.servicesFormArray.controls.length > 0) {
            const lastIndex = this.servicesFormArray.controls.length - 1;

            return (this.servicesFormArray.controls[lastIndex] as FormGroup).controls.startAtFormControl.value;
        } else
            return undefined;
    }

    ngOnInit(): void {
        // Get templates
        this.templateService.getAll()
        .subscribe(template => {
            this.templates = [
                template
            ];
        });
        this.onFormChanges();
    }

    onFormChanges(): void {
        this.templateSelectorFormGroup.valueChanges.subscribe(val => {
            if (val.templateSelectorFormControl)
                (val.templateSelectorFormControl as Template).services.forEach(service => {
                    const startAt: moment.Moment = moment()
                    .isoWeekday(+service.startAt.day)
                    .set({
                        hour: +service.startAt.hours,
                        minute: +service.startAt.minutes,
                        second: 0,
                        millisecond: 0
                    });
                    const endAt: moment.Moment = moment()
                    .isoWeekday(+service.endAt.day)
                    .set({
                        hour: +service.endAt.hours,
                        minute: +service.endAt.minutes,
                        second: 0,
                        millisecond: 0
                    });
                    const firstDayOfNextWeek = this.getFirstDayOfNextWeek();
                    while (startAt.isBefore(firstDayOfNextWeek)) {
                        startAt.add(1, 'week');
                        endAt.add(1, 'week');
                    }
                    this.addServiceForm(service.nbMax, startAt, endAt);
                });
            this.sortServiceForm();
        });
    }

    getFirstDayOfNextWeek(): moment.Moment {
        const firstDay = moment()
        .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        });
        // tslint:disable-next-line:newline-per-chained-call
        if (moment().isoWeekday() <= DEFAULT_WEEK_SWITCH)
            firstDay.isoWeekday(+DEFAULT_WEEK_SWITCH + 1);
        else
            firstDay.isoWeekday(+DEFAULT_WEEK_SWITCH + 1)
            .add(1, 'week');

        return firstDay;
    }

    createServices(): void {
        const services: Array<Service> = this.servicesFormArray.controls.map(formGroup => {
            return this.prepareService((formGroup as FormGroup).controls);
        });
        this.serviceService.create(services)
        .subscribe(() => {
            this.toasterService.showToaster('Nouveaux services enregistrés');
            this.router.navigate(['/dashboard']);
        });
    }

    prepareService(controls): Service {
        return {
            startAt: controls.startAtFormControl.value,
            endAt: controls.endAtFormControl.value,
            nbMax: controls.nbMaxFormControl.value
        };
    }
}
