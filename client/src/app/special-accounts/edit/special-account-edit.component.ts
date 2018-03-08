import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialAccount } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { SpecialAccountService } from '../../_services/index';

@Component({
  templateUrl: './special-account-edit.component.html',
})

export class SpecialAccountEditComponent implements OnInit {
    id: string;
    code: string;
    description: string;

    codeFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private specialAccountService: SpecialAccountService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.specialAccountService.getById(+this.id).subscribe(role => {
                this.description = role.description;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const specialAccount = new SpecialAccount();
        specialAccount.id = +this.id;
        specialAccount.description = this.description;
        // TODO implement code dialog
        const code = null;
        this.specialAccountService.update(specialAccount, code).subscribe(() => {
            this.toasterService.showToaster('Compte special modifié', 'Fermer');
            this.router.navigate(['/specialaccounts']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
