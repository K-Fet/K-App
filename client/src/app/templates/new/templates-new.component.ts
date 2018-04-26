import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Template } from '../../_models/index';

@Component({
    templateUrl: './templates-new.component.html',
})

export class TemplateNewComponent {
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

    serviceForm: FormGroup;
    templateForm: FormGroup;
    formArray: FormArray;

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
        this.createForm();
    }

    createForm(): void {
        this.serviceForm = this.fb.group({
            startFormControl: new FormControl('', [Validators.required]),
            endFormControl: new FormControl('', [Validators.required]),
            dayFormControl: new FormControl('', [Validators.required]),
            nbMaxFormControl: new FormControl('', [Validators.required]),
        });
        this.formArray = this.fb.array([
            this.serviceForm,
        ]);
        this.templateForm = this.fb.group({
            nameFormControl: new FormControl('', [Validators.required]),
            formArray: this.formArray,
        });
    }

    toNumber(date: Date, selectedDay): { day: Number, hours: Number, minutes: Number } {
        return {
            day: selectedDay,
            hours: date.getHours(),
            minutes: date.getMinutes(),
        };
    }

    addService(): void {
        const val = {
            nbMax: this.nbMax,
            startAt: this.toNumber(this.startAt, this.selectedDay),
            endAt: this.toNumber(this.endAt, this.selectedDay),
        };
        console.log(this.services.push(val));
        console.log("coucou");
    }
}
