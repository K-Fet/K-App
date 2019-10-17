import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from '../provider.model';
import { getProviderFromForm, getProviderModel } from '../providers.form-model';
import { ToasterService } from '../../../core/services/toaster.service';
import { ProvidersService } from '../../api-services/providers.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalProvider: Provider;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private providersService: ProvidersService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { provider: Provider }) => {
      this.originalProvider = data.provider;
      this.model = getProviderModel(this.originalProvider);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  async onNgSubmit() {
    const updatedProvider = getProviderFromForm(this.formGroup, this.originalProvider);
    await this.providersService.update(updatedProvider);
    this.toasterService.showToaster('Fournisseur mis à jour');
    this.router.navigate(['/inventory-management/providers']);
  }
}
