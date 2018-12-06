import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Permission, Role } from '../../_models';
import { PermissionService, RoleService, ToasterService } from '../../_services';

interface PermissionObj {
  permission: Permission;
  isChecked: boolean;
}

@Component({
  templateUrl: './role-new.component.html',
})
export class RoleNewComponent implements OnInit {
  roleForm: FormGroup;
  permissions: PermissionObj[] = [];

  constructor(private roleService: RoleService,
              private toasterService: ToasterService,
              private router: Router,
              private permissionService: PermissionService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.permissionService.getAll().subscribe((permissions) => {
      permissions.forEach((permission) => {
        this.permissions.push({
          permission,
          isChecked: false,
        });
      });
    });
    this.roleForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  add(): void {
    const role = new Role(this.roleForm.value);
    // Associations
    const add = this.permissions.filter((permission) => {
      return permission.isChecked;
    });
    if (add.length > 0) {
      role._embedded = {
        permissions: {
          add: add.map(perm => perm.permission.id),
        },
      };
    }
    this.roleService.create(role).subscribe(() => {
      this.toasterService.showToaster('Rôle créé');
      this.router.navigate(['/roles']);
    });
  }
}
