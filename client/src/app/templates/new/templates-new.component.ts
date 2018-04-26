import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
//import { Template } from '../../_models/index';

@Component({
    templateUrl: './templates-new.component.html',
})

export class TemplateNewComponent {
   /*
    name: String;
    template: Template = new Template();

    startAt: Date;
    endAt: Date;
    selectedDay: Number;
    nbMax: Number;

    services: Array<{
        nbMax: Number,
        startAt: {
            day: Number,
            hours: Number,
            minutes: Number
        },
        endAt: {
            day: Number,
            hours: Number,
            minutes: Number
        }
    }>;
*/
    templateNameFormGroup: FormGroup;
    servicesFormArray: FormArray;
    generalFormArray: FormArray;
    generalFormGroup: FormGroup;

    WEEK_DAY = [
        { id: '1', value: 'Lundi' },
        { id: '2', value: 'Mardi' },
        { id: '3', value: 'Mercredi' },
        { id: '4', value: 'Jeudi' },
        { id: '5', value: 'Vendredi' },
        { id: '6', value: 'Samedi' },
        { id: '7', value: 'Dimanche' } ];

    constructor(
        private fb: FormBuilder
    ) {
        this.createForms();
    }

    createForms(): void {
        this.templateNameFormGroup = this.fb.group({
            templateNameFormControl: ['', [Validators.required]],
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


   /* toNumber(date: Date, selectedDay): { day: Number, hours: Number, minutes: Number } {
        return {
            day: selectedDay,
            hours: date.getHours(),
            minutes: date.getMinutes(),
        };
    }*/

  /*  addService(): void {
        const val = {
            nbMax: this.nbMax,
            startAt: this.toNumber(this.startAt, this.selectedDay),
            endAt: this.toNumber(this.endAt, this.selectedDay),
        };
    } */
}
