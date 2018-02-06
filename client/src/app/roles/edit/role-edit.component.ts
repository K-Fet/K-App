import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { RoleService } from '../../_services/role.service';

@Component({
  templateUrl: './role-edit.component.html',
})

export class RoleEditComponent implements OnInit {
    id: string;
    name: string;
    description: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private roleService: RoleService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.roleService.getById(+this.id).subscribe(role => {
                this.name = role.name;
                this.description = role.description;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const role = new Role();
        role.id = +this.id;
        role.name = this.name;
        role.description = this.description;
        this.roleService.update(role).subscribe(() => {
            this.toasterService.showToaster('Rôle modifié', 'Fermer');
            this.router.navigate(['/roles']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
