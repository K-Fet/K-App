import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';
import { getKommissionFromForm, getKommissionModel } from '../kommissions.form-model';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getKommissionModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  onNgSubmit() {
    this.kommissionService.create(getKommissionFromForm(this.formGroup)).subscribe(() => {
      this.toasterService.showToaster('Kommission créée');
      this.router.navigate(['/kommissions']);
    });
  }
}
