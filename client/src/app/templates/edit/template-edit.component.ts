import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Template, TemplateDateUnit, TemplateServiceUnit } from '../../_models/Template';
import * as moment from 'moment';

@Component({
    templateUrl: './template-edit.component.html',
})

export class TemplateEditComponent implements OnInit {

    templateNameFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;
    servicesFormGroup: FormGroup;
    templateId: Number;

    selectedStartDay: Array<String>;
    selectedEndDay: Array<String>;

    WEEK_DAY = [
        { id: '1', value: 'Lundi' },
        { id: '2', value: 'Mardi' },
        { id: '3', value: 'Mercredi' },
        { id: '4', value: 'Jeudi' },
        { id: '5', value: 'Vendredi' },
        { id: '6', value: 'Samedi' },
        { id: '7', value: 'Dimanche' } ];

    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService
    ) {
        this.createForms();
    }

    createForms(): void {
        this.templateNameFormGroup = this.fb.group({
            templateNameFormControl: ['', Validators.required],
        });
        this.servicesFormArray = this.fb.array([]);
        this.generalFormArray = this.fb.array([
            this.templateNameFormGroup,
            this.servicesFormArray,
        ]);
        this.generalFormGroup = this.fb.group({
            generalFormArray: this.generalFormArray,
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.templateId = params['id'];
            this.templateService.getById(params['id']).subscribe((template: Template) => {
                this.templateNameFormGroup.controls.templateNameFormControl.setValue(template.name);
                this.addServiceFormFromTemplate(template);
                this.sortServiceForm();
            });
        });

    }

    addServiceFormFromTemplate(template: Template): void {
        template.services.forEach(service => {
            const startTime = moment().isoWeekday(service.startAt.day.toString())
                .hour(service.startAt.hours as number).minute(service.startAt.minutes as number);
            const endTime = moment().isoWeekday(service.endAt.day.toString())
                .hour(service.endAt.hours as number).minute(service.endAt.minutes as number);
            const serviceFormGroup = this.fb.group({
                startFormControl: [startTime.format('HH:mm'), Validators.required],
                startDayFormControl: [service.startAt.day.toString(), Validators.required],
                endFormControl: [endTime.format('HH:mm'), Validators.required],
                endDayFormControl: [service.endAt.day.toString(), Validators.required],
                nbMaxFormControl: [service.nbMax, Validators.required],
            });
            serviceFormGroup.valueChanges.subscribe(() => {
                this.sortServiceForm();
            });
            this.servicesFormArray.push(serviceFormGroup);
        });
    }

    addEmptyServiceForm(): void {
        const serviceFormGroup = this.fb.group({
            startFormControl: ['', Validators.required],
            startDayFormControl: ['', Validators.required],
            endFormControl: ['', Validators.required],
            endDayFormControl: ['', Validators.required],
            nbMaxFormControl: ['', Validators.required],
        });
        serviceFormGroup.valueChanges.subscribe(() => {
            this.sortServiceForm();
        });
        this.servicesFormArray.push(serviceFormGroup);
    }

    updateTemplate(): void {
        const template = new Template();
        template.id = this.templateId;
        template.name = this.templateNameFormGroup.controls.templateNameFormControl.value;
        template.services = this.servicesFormArray.controls.map(formGroup => {
            return this.prepareService((formGroup as FormGroup).controls);
        });
        this.templateService.update(template).subscribe(() => {
            this.toasterService.showToaster('Template modifié');
            this.router.navigate(['/templates']);
        });
    }

    prepareService(controls): TemplateServiceUnit {
        return {
            nbMax: controls.nbMaxFormControl.value,
            startAt: this.toNumber(controls.startFormControl.value, controls.startDayFormControl.value),
            endAt: this.toNumber(controls.endFormControl.value, controls.endDayFormControl.value),
        };
    }

    sortServiceForm(): void {
        this.servicesFormArray.controls.sort((a, b) => {
            const aValue = (a as FormGroup).value;
            const bValue = (b as FormGroup).value;
            const aStartAt = moment().isoWeekday(+aValue.startDayFormControl).set({
                'hour': aValue.startFormControl ? aValue.startFormControl.split(':')[0] : 0,
                'minute': aValue.startFormControl ? aValue.startFormControl.split(':')[1] : 0,
                'second': 0,
                'millisecond': 0,
            });
            const bStartAt = moment().isoWeekday(+bValue.startDayFormControl).set({
                'hour': bValue.startFormControl ? bValue.startFormControl.split(':')[0] : 0,
                'minute': bValue.startFormControl ? bValue.startFormControl.split(':')[1] : 0,
                'second': 0,
                'millisecond': 0,
            });
            if (aStartAt.isBefore(bStartAt)) {
                return -1;
            } else if (aStartAt.isAfter(bStartAt)) {
                return 1;
            }
            return 0;
        });
    }

    getControls(): Array<AbstractControl> {
        return (this.generalFormArray.get([1]) as FormArray).controls;
    }

    removeServiceForm(fromGroupId: Number): void {
        this.servicesFormArray.removeAt(+fromGroupId);
    }

    toNumber(date: String, selectedDay): TemplateDateUnit {
        return {
            day: selectedDay,
            hours: +date.split(':')[0],
            minutes: +date.split(':')[1],
        };
    }

    findWeekDay(dayId: String): String {
        return this.WEEK_DAY.find(day => day.id === dayId).value;
    }
}
