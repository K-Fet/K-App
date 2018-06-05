import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Permission, Role } from '../../_models';
import { PermissionService, RoleService, ToasterService } from '../../_services';

interface PermissionObj {
  permission: Permission;
  isChecked: Boolean;
}

@Component({
  templateUrl: './role-new.component.html',
})
export class RoleNewComponent implements OnInit {
  name: string;
  description: string;

  permissions: PermissionObj[] = [];

  nameFormControl: FormControl = new FormControl('', [Validators.required]);
  descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    private roleService: RoleService,
    private toasterService: ToasterService,
    private router: Router,
    private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.permissionService.getAll().subscribe((permissions) => {
      permissions.forEach((permission) => {
        this.permissions.push({
          permission,
          isChecked: false,
        });
      });
    });

  }

  add(): void {
    const role = new Role();
    role.name = this.name;
    role.description = this.description;
    // Associations
    const add = this.permissions.filter((permission) => {
      return permission.isChecked === true;
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
