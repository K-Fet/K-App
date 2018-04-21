import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission, Role } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { PermissionService, RoleService } from '../../_services';

@Component({
    templateUrl: './role-edit.component.html',
})

export class RoleEditComponent implements OnInit {
    id: String;
    name: String;
    description: String;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
        initial: Boolean,
    }> = [];

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private roleService: RoleService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private permissionService: PermissionService
    ) {}

    ngOnInit(): void {
        this.permissionService.getAll().subscribe(permissions => {
            permissions.forEach(permission => {
                this.permissions.push({
                    permission: permission,
                    isChecked: false,
                    initial: false,
                });
            });
        });
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.roleService.getById(+this.id).subscribe(role => {
                this.name = role.name;
                this.description = role.description;
                if (role.permissions) {
                    role.permissions.forEach(rolePermission => {
                        if (this.permissions) {
                            this.permissions.filter(permission => {
                                return rolePermission.id === permission.permission.id;
                            }).forEach(permission => {
                                permission.isChecked = true;
                                permission.initial = true;
                            });
                        }
                    });
                }
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
            id : +this.id,
            name : this.name,
            description : this.description,
        });
        // Associations
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true && permission.initial !== permission.isChecked;
        });
        const remove = this.permissions.filter(permission => {
            return permission.isChecked === false && permission.initial !== permission.isChecked;
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
}
