import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { PermissionService } from '../../../core/api-services/permission.service';
import { Permission } from '../../../shared/models';
import { RoleService } from '../../../core/api-services/role.service';
import { getRoleFromForm, getRoleModel } from '../roles.form-model';
import { PermissionsSelectorComponent } from '../../permissions-selector/permissions-selector.component';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  permissions: Permission[];

  @ViewChild(PermissionsSelectorComponent, { static: true }) permSelector: PermissionsSelectorComponent;

  constructor(private formService: DynamicFormService,
              private roleService: RoleService,
              private permissionService: PermissionService,
              private toasterService: ToasterService,
              private router: Router) { }

  ngOnInit() {
    this.permissionService.getAll().then(permissions => this.permissions = permissions);

    this.model = getRoleModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    const newRole = getRoleFromForm(
      this.formGroup,
      this.permSelector.selectedPermissions.map(p => p.id),
    );

    await this.roleService.create(newRole);
    this.toasterService.showToaster('Rôle créé');
    this.router.navigate(['/acl/roles']);
  }
}
