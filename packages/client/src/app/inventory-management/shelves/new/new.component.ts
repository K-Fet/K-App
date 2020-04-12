import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ShelvesService } from '../../api-services/shelves.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { getShelfFromForm, getShelfModel } from '../shelves.form-model';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private shelvesService: ShelvesService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getShelfModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    await this.shelvesService.create(getShelfFromForm(this.formGroup));
    this.toasterService.showToaster('Rayon créé');
    this.router.navigate(['/inventory-management/shelves']);
  }
}
