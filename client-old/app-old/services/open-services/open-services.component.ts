import { Component, OnInit } from '@angular/core';
import {
  DEFAULT_WEEK_SWITCH,
  ServiceService,
  TemplateService,
  ToasterService,
} from '../../_services';
import { Service, Template } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-open-services',
  templateUrl: './open-services.component.html',
})

export class OpenServicesComponent implements OnInit {

  templates: Template[] = [];
  services: Service[] = [];
  selectedTemplate: Template;

  templateSelectorFormGroup: FormGroup;
  servicesFormArray: FormArray;
  generalFormArray: FormArray;
  generalFormGroup: FormGroup;

  constructor(private templateService: TemplateService,
              private toasterService: ToasterService,
              private serviceService: ServiceService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router: Router) {
    this.createForms();
  }

  createForms(): void {
    this.templateSelectorFormGroup = this.formBuilder.group({
      templateSelectorFormControl: [''/*, Validators.required*/],
    });
    this.servicesFormArray = this.formBuilder.array([]);
    this.generalFormArray = this.formBuilder.array([
      this.templateSelectorFormGroup,
      this.servicesFormArray,
    ]);
    this.generalFormGroup = this.formBuilder.group({
      generalFormArray: this.generalFormArray,
    });
  }

  addServiceForm(nbMax: number, startAt: Moment, endAt: Moment): void {
    const serviceFormGroup = this.formBuilder.group({
      nbMaxFormControl: [nbMax, Validators.required],
      startAtFormControl: [startAt ? startAt.toDate() : '', Validators.required],
      endAtFormControl: [endAt ? endAt.toDate() : '', Validators.required],
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
      }
      if (aStartAt > bStartAt) {
        return 1;
      }
      return 0;
    });
  }

  removeServiceForm(fromGroupId: number): void {
    this.servicesFormArray.removeAt(+fromGroupId);
  }

  getControls(): AbstractControl[] {
    return (this.generalFormArray.get([1]) as FormArray).controls;
  }

  getFirstServiceDate(): Date {
    if (this.servicesFormArray.controls.length > 0) {
      return (this.servicesFormArray.controls[0] as FormGroup).controls.startAtFormControl.value;
    }
    return null;
  }

  getLastServiceDate(): Date {
    if (this.servicesFormArray.controls.length > 0) {
      const lastIndex = this.servicesFormArray.controls.length - 1;

      return (this.servicesFormArray.controls[lastIndex] as FormGroup).controls.startAtFormControl.value;
    }
    return null;
  }

  ngOnInit(): void {
    // Get templates
    this.templateService.getAll().subscribe((templates) => {
      this.templates = templates;
    });
    this.onFormChanges();
  }

  onFormChanges(): void {
    const firstDayOfNextWeek = this.getFirstDayOfNextWeek();
    this.templateSelectorFormGroup.valueChanges.subscribe((val) => {
      if (val.templateSelectorFormControl) {
        (val.templateSelectorFormControl as Template).services.forEach((service) => {
          const startAt: Moment = moment().isoWeekday(service.startAt.day).set({
            hour: service.startAt.hours,
            minute: service.startAt.minutes,
            second: 0,
            millisecond: 0,
          });
          const endAt: Moment = moment().isoWeekday(service.endAt.day).set({
            hour: service.endAt.hours,
            minute: service.endAt.minutes,
            second: 0,
            millisecond: 0,
          });
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
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (moment().isoWeekday() <= DEFAULT_WEEK_SWITCH) {
      firstDay.isoWeekday(DEFAULT_WEEK_SWITCH + 1);
    } else {
      firstDay.isoWeekday(DEFAULT_WEEK_SWITCH + 1).add(1, 'week');
    }
    return firstDay;
  }

  createServices(): void {
    const services: Service[] = this.servicesFormArray.controls.map((formGroup) => {
      return this.prepareService((formGroup as FormGroup).controls);
    });

    this.serviceService.get(moment(services[0].startAt), moment(services[services.length - 1].endAt))
      .subscribe((actualServices) => {
        if (actualServices.length !== 0) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: {
              title: 'Des services existent déjà ...',
              message: `Il existe actuellement ${actualServices.length} service(s)` +
                ' sur le lapse de temps envisagé. Êtes-vous sur de vouloir créer les services?',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.callServer(services);
            }
          });
        } else {
          this.callServer(services);
        }
      });
  }

  callServer(services: any): void {
    this.serviceService.create(services).subscribe(() => {
      this.toasterService.showToaster('Nouveaux services enregistrés');
      this.router.navigate(['/']);
    });
  }

  prepareService(controls): Service {
    return new Service({
      startAt: controls.startAtFormControl.value,
      endAt: controls.endAtFormControl.value,
      nbMax: controls.nbMaxFormControl.value,
    });
  }
}
