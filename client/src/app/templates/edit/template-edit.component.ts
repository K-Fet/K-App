import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateService } from '../../_services/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../_models/Template';

@Component({
    templateUrl: './template-edit.component.html',
})

export class TemplateEditComponent implements OnInit {

    templateNameFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;

    WEEK_DAY = [
        { id: '0', value: 'Lundi' },
        { id: '1', value: 'Mardi' },
        { id: '2', value: 'Mercredi' },
        { id: '3', value: 'Jeudi' },
        { id: '4', value: 'Vendredi' },
        { id: '5', value: 'Samedi' },
        { id: '6', value: 'Dimanche' } ];

    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        private route: ActivatedRoute
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
            this.templateService.getById(params['id']).subscribe(template => {
                (template as Template).services.forEach(service => {
                    // modifier pour chaque service le startAt et endAt
                //   this.addServiceForm(service.nbMax, startAt, endAt);
              //  this.sortServiceForm();
                });


            })
        })
        
    }

    addServiceForm(nbMax: Number, startAt: Date, endAt: Date, startDay: Number, endDay: Number): void {
        const serviceFormGroup = this.fb.group({
            startFormControl: [startAt, Validators.required],
            startDayFormControl: [startDay, Validators.required],
            endFormControl: [endAt, Validators.required],
            endDayFormControl: [endDay, Validators.required],
            nbMaxFormControl: [nbMax, Validators.required],
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
            if (aStartAt < bStartAt) {
                return -1;
            } else if (aStartAt > bStartAt) {
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

    toNumber(date: String, selectedDay): { day: Number, hours: Number, minutes: Number; } {
        return {
            day: selectedDay,
            hours: Number(date.split(':')[0]),
            minutes: Number(date.split(':')[1]),
        };
    }
}
