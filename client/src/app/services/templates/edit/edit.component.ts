import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { Template, TemplateDateUnit, TemplateServiceUnit } from '../../../shared/models';
import { TemplateService } from '../../../core/api-services/template.service';
import { templateDateToDate } from '../templates.helper';
import { compareAsc, format } from 'date-fns';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  templateNameFormGroup: FormGroup;
  servicesFormArray: FormArray;
  generalFormArray: FormArray;
  generalFormGroup: FormGroup;
  servicesFormGroup: FormGroup;
  templateId: number;

  selectedStartDay: string[];
  selectedEndDay: string[];

  WEEK_DAY = [
    { id: '1', value: 'Lundi' },
    { id: '2', value: 'Mardi' },
    { id: '3', value: 'Mercredi' },
    { id: '4', value: 'Jeudi' },
    { id: '5', value: 'Vendredi' },
    { id: '6', value: 'Samedi' },
    { id: '7', value: 'Dimanche' }];

  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
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
    this.route.params.subscribe(async (params) => {
      this.templateId = params['id'];
      const template = await this.templateService.getById(params['id']);
      this.templateNameFormGroup.controls.templateNameFormControl.setValue(template.name);
      this.addServiceFormFromTemplate(template);
      this.sortServiceForm();
    });

  }

  addServiceFormFromTemplate(template: Template): void {
    template.services.forEach((service) => {
      const startTime = templateDateToDate(service.startAt);
      const endTime = templateDateToDate(service.endAt);

      const serviceFormGroup = this.fb.group({
        startFormControl: [format(startTime, 'HH:mm'), Validators.required],
        startDayFormControl: [service.startAt.day.toString(), Validators.required],
        endFormControl: [format(endTime, 'HH:mm'), Validators.required],
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

  async updateTemplate() {
    const template = new Template();
    template.id = this.templateId;
    template.name = this.templateNameFormGroup.controls.templateNameFormControl.value;
    template.services = this.servicesFormArray.controls.map((formGroup) => {
      return this.prepareService((formGroup as FormGroup).controls);
    });
    await this.templateService.update(template);
    this.toasterService.showToaster('Template modifié');
    this.router.navigate(['/services/templates']);
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

      const aStartAt = templateDateToDate({
        day: +aValue.startDayFormControl,
        hours: aValue.startFormControl ? aValue.startFormControl.split(':')[0] : 0,
        minutes: aValue.startFormControl ? aValue.startFormControl.split(':')[1] : 0,
      });

      const bStartAt = templateDateToDate({
        day: +bValue.startDayFormControl,
        hours: bValue.startFormControl ? bValue.startFormControl.split(':')[0] : 0,
        minutes: bValue.startFormControl ? bValue.startFormControl.split(':')[1] : 0,
      });

      return compareAsc(aStartAt, bStartAt);
    });
  }

  getControls(): AbstractControl[] {
    return (this.generalFormArray.get([1]) as FormArray).controls;
  }

  removeServiceForm(fromGroupId: number): void {
    this.servicesFormArray.removeAt(+fromGroupId);
  }

  toNumber(date: string, selectedDay): TemplateDateUnit {
    return {
      day: selectedDay,
      hours: +date.split(':')[0],
      minutes: +date.split(':')[1],
    };
  }

  findWeekDay(dayId: string): string {
    return this.WEEK_DAY.find(day => day.id === dayId).value;
  }
}
