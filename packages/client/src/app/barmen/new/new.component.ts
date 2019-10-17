import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getBarmanFromForm, getBarmanModel } from '../barmen.form-model';
import { BarmanService } from '../../core/api-services/barman.service';
import { RoleService } from '../../core/api-services/role.service';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private barmanService: BarmanService,
              private kommissionService: KommissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getBarmanModel(
      this.barmanService.getAll(),
      this.kommissionService.getAll(),
      this.roleService.getAll(),
    );
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    await this.barmanService.create(getBarmanFromForm(this.formGroup));
    this.toasterService.showToaster('Barman créé');
    this.router.navigate(['/barmen']);
  }
}
