import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ServiceService } from '../../core/api-services/service.service';
import { ToasterService } from '../../core/services/toaster.service';
import { TemplateService } from '../../core/api-services/template.service';
import { Service, Template } from '../../shared/models';
import { templateDateToDate } from '../templates/templates.helper';
import { addWeeks, isBefore } from 'date-fns';
import { getFirstDayOfNextWeek } from '../../shared/utils';

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

  addServiceForm(nbMax: number, startAt: Date, endAt: Date): void {
    const serviceFormGroup = this.formBuilder.group({
      nbMaxFormControl: [nbMax, Validators.required],
      startAtFormControl: [startAt, Validators.required],
      endAtFormControl: [endAt, Validators.required],
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

  async ngOnInit() {
    this.onFormChanges();
    // Get templates
    this.templates = await this.templateService.getAll();
  }

  onFormChanges(): void {
    const firstDayOfNextWeek = getFirstDayOfNextWeek();
    this.templateSelectorFormGroup.valueChanges.subscribe((val) => {
      if (val.templateSelectorFormControl) {
        (val.templateSelectorFormControl as Template).services.forEach((service) => {
          let startAt = templateDateToDate(service.startAt);
          let endAt = templateDateToDate(service.endAt);

          while (isBefore(startAt, firstDayOfNextWeek)) {
            startAt = addWeeks(startAt, 1);
            endAt = addWeeks(startAt, 1);
          }
          this.addServiceForm(service.nbMax, startAt, endAt);
        });
      }
      this.sortServiceForm();
    });
  }

  async createServices() {
    const services: Service[] = this.servicesFormArray.controls.map((formGroup) => {
      return this.prepareService((formGroup as FormGroup).controls);
    });

    const actualServices = await this.serviceService.get(services[0].startAt, services[services.length - 1].endAt);
    if (actualServices.length === 0) return this.callServer(services);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Des services existent déjà ...',
        message: `Il existe actuellement ${actualServices.length} service(s)` +
          ' sur le lapse de temps envisagé. Êtes-vous sur de vouloir créer les services?',
      },
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (result) this.callServer(services);
  }

  async callServer(services: any) {
    await this.serviceService.create(services);
    this.toasterService.showToaster('Nouveaux services enregistrés');
    this.router.navigate(['/']);
  }

  prepareService(controls): Service {
    return new Service({
      startAt: controls.startAtFormControl.value,
      endAt: controls.endAtFormControl.value,
      nbMax: controls.nbMaxFormControl.value,
    });
  }
}
