import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms2/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KommissionsService } from '../../core/api-services/kommissions.service';
import { ToasterService } from '../../core/services/toaster.service';
import { getKommissionFromForm, getKommissionModel } from '../kommissions.form-model';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private kommissionService: KommissionsService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getKommissionModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    await this.kommissionService.create(getKommissionFromForm(this.formGroup));
    this.toasterService.showToaster('Kommission créée');
    this.router.navigate(['/kommissions']);
  }
}
