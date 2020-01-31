import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { Template } from '../../../shared/models';
import { TemplateService } from '../../../core/api-services/template.service';
import { getUnitFromControls, templateDateToDate } from '../templates.helper';
import { compareAsc, format } from 'date-fns';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  templateNameFormGroup: FormGroup;
  servicesFormArray: FormArray;
  generalFormArray: FormArray;
  generalFormGroup: FormGroup;

  originalTemplate: Template;

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
    this.route.data.subscribe((data: { template: Template }) => {
      this.originalTemplate = data.template;
      this.templateNameFormGroup.controls.templateNameFormControl.setValue(data.template.name);
      this.addServiceFormFromTemplate(data.template);
      this.sortServiceForm();
    });
  }

  addServiceFormFromTemplate(template: Template): void {
    template.services.forEach((service) => {
      const { startAt, endAt } = templateDateToDate(service);

      const serviceFormGroup = this.fb.group({
        startFormControl: [format(startAt, 'HH:mm'), Validators.required],
        startDayFormControl: [service.startDay.toString(), Validators.required],
        endFormControl: [format(endAt, 'HH:mm'), Validators.required],
        endDayFormControl: [service.endDay.toString(), Validators.required],
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

  async updateTemplate(): Promise<void> {
    const template: Template = {
      _id: this.originalTemplate._id,
      name: this.templateNameFormGroup.controls.templateNameFormControl.value,
      services: this.servicesFormArray.controls.map((formGroup) => {
        return getUnitFromControls((formGroup as FormGroup).controls);
      }),
    };

    await this.templateService.update(template);
    this.toasterService.showToaster('Template modifié');
    this.router.navigate(['/services/templates']);
  }

  sortServiceForm(): void {
    this.servicesFormArray.controls.sort((a, b) => {
      const aValue = (a as FormGroup).value;
      const bValue = (b as FormGroup).value;

      const { startAt: aStartAt } = templateDateToDate(getUnitFromControls(aValue));
      const { startAt: bStartAt } = templateDateToDate(getUnitFromControls(bValue));

      return compareAsc(aStartAt, bStartAt);
    });
  }

  getControls(): AbstractControl[] {
    return (this.generalFormArray.get([1]) as FormArray).controls;
  }

  removeServiceForm(fromGroupId: number): void {
    this.servicesFormArray.removeAt(+fromGroupId);
  }

  findWeekDay(dayId: string): string {
    return this.WEEK_DAY.find(day => day.id === dayId).value;
  }
}
