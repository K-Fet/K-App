import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@k-fet/ng-dynamic-forms-core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { RolesService } from '../../../core/api-services/roles.service';
import { getRoleFromForm, getRoleModel } from '../roles.form-model';
import { PermissionsSelectorComponent } from '../../permissions-selector/permissions-selector.component';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  permissions: string[];

  @ViewChild(PermissionsSelectorComponent, { static: true }) permSelector: PermissionsSelectorComponent;

  constructor(private formService: DynamicFormService,
              private roleService: RolesService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.model = getRoleModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    const newRole = getRoleFromForm(this.formGroup, this.permSelector.selectedPermissions);

    await this.roleService.create(newRole);
    this.toasterService.showToaster('Rôle créé');
    this.router.navigate(['/acl/roles']);
  }
}
