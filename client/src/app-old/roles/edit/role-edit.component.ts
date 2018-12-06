import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission, Role } from '../../_models';
import { PermissionService, RoleService, ToasterService } from '../../_services';

interface PermissionObj {
  permission: Permission;
  isChecked: boolean;
  initial: boolean;
}

@Component({
  templateUrl: './role-edit.component.html',
})
export class RoleEditComponent implements OnInit {
  id: string;
  permissions: PermissionObj[] = [];
  roleForm: FormGroup;

  constructor(private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router,
              private permissionService: PermissionService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
    this.permissionService.getAll().subscribe((permissions) => {
      permissions.forEach((permission) => {
        this.permissions.push({
          permission,
          isChecked: false,
          initial: false,
        });
      });
      this.route.params.subscribe((params) => {
        this.id = params['id'];
        this.roleService.getById(+this.id).subscribe((role) => {
          this.roleForm.controls['name'].setValue(role.name);
          this.roleForm.controls['description'].setValue(role.description);
          if (role.permissions) {
            role.permissions.forEach((rolePermission) => {
              if (this.permissions) {
                this.permissions.filter((permission) => {
                  return rolePermission.id === permission.permission.id;
                }).forEach((permission) => {
                  permission.isChecked = true;
                  permission.initial = true;
                });
              }
            });
          }
        });
      });
    });
  }

  edit(): void {
    const role = this.prepareEditing();
    this.roleService.update(role).subscribe(() => {
      this.toasterService.showToaster('Rôle modifié');
      this.router.navigate(['/roles']);
    });
  }

  prepareEditing(): Role {
    const role = new Role({
      id: +this.id,
      ...this.roleForm.value,
    });
    // Associations
    const add = this.permissions.filter((permission) => {
      return permission.isChecked && permission.initial !== permission.isChecked;
    });
    const remove = this.permissions.filter((permission) => {
      return !permission.isChecked && permission.initial !== permission.isChecked;
    });
    if (add.length > 0) {
      role._embedded = {
        permissions: {
          add: add.map(perm => perm.permission.id),
        },
      };
    }
    if (remove.length > 0) {
      if (role._embedded) {
        role._embedded.permissions.remove = remove.map(perm => perm.permission.id);
      } else {
        role._embedded = {
          permissions: {
            remove: remove.map(perm => perm.permission.id),
          },
        };
      }
    }

    return role;
  }

  disable(): boolean {
    const add = this.permissions.filter((permission) => {
      return permission.isChecked && permission.initial !== permission.isChecked;
    });
    const remove = this.permissions.filter((permission) => {
      return !permission.isChecked && permission.initial !== permission.isChecked;
    });
    return add.length === 0 && remove.length === 0;
  }
}
