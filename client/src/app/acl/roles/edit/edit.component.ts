import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission, Role } from '../../../shared/models';
import { ToasterService } from '../../../core/services/toaster.service';
import { PermissionService } from '../../../core/api-services/permission.service';
import { PermissionsSelectorComponent } from '../../permissions-selector/permissions-selector.component';
import { RoleService } from '../../../core/api-services/role.service';
import { getRoleFromForm, getRoleModel } from '../roles.form-model';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalRole: Role;

  permissions: Permission[] = [];

  @ViewChild(PermissionsSelectorComponent) permSelector: PermissionsSelectorComponent;

  constructor(private formService: DynamicFormService,
              private permissionService: PermissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.permissionService.getAll().then(permissions => this.permissions = permissions);

    this.route.data.subscribe((data: { role: Role }) => {
      this.originalRole = data.role;
      this.model = getRoleModel(this.originalRole);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  async onNgSubmit() {
    const updatedRole = getRoleFromForm(
      this.formGroup,
      this.permSelector.selectedPermissions.map(p => p.id),
      this.originalRole,
    );

    await this.roleService.update(updatedRole);
    this.toasterService.showToaster('Rôle modifié');
    this.router.navigate(['/acl/roles']);
  }
}
