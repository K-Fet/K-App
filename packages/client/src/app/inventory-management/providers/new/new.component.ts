import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms2/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProvidersService } from '../../api-services/providers.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { getProviderFromForm, getProviderModel } from '../providers.form-model';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private providersService: ProvidersService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getProviderModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    await this.providersService.create(getProviderFromForm(this.formGroup));
    this.toasterService.showToaster('Fournisseur créé');
    this.router.navigate(['/inventory-management/providers']);
  }
}
