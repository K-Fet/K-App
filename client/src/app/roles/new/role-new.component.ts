import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { RoleService } from '../../_services/role.service';

@Component({
  templateUrl: './role-new.component.html',
})

export class RoleNewComponent implements OnInit {
    name: string;
    description: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private roleService: RoleService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

    }

    add() {
        const role = new Role();
        role.name = this.name;
        role.description = this.description;
        this.roleService.create(role).subscribe(() => {
            this.toasterService.showToaster('Rôle créé', 'Fermer');
            this.router.navigate(['/roles'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
