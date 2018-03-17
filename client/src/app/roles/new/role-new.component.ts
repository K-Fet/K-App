import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role, Permission } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { RoleService } from '../../_services/role.service';
import { PermissionService } from '../../_services';


@Component({
  templateUrl: './role-new.component.html',
})

export class RoleNewComponent implements OnInit {
    name: string;
    description: string;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
    }> = [];

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private roleService: RoleService, private toasterService: ToasterService, private router: Router, private permissionService: PermissionService) {}
    ngOnInit(): void {
        this.permissionService.getAll().subscribe(permissions => {
            permissions.forEach(permission => {
                this.permissions.push({
                    permission: permission,
                    isChecked: false,
                });
            });
        });

    }

    add() {
        const role = new Role();
        role.name = this.name;
        role.description = this.description;
        // Associations
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true;
        });
        if (add.length > 0) {
            role._embedded = {
                permissions: {
                    add: add.map(perm => perm.permission.id),
                }
            };
        }
        this.roleService.create(role).subscribe(() => {
            this.toasterService.showToaster('Rôle créé', 'Fermer');
            this.router.navigate(['/roles'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
