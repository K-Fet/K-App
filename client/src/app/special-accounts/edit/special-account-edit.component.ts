import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialAccount } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { SpecialAccountService } from '../../_services/index';

@Component({
  templateUrl: './special-account-edit.component.html',
})

export class SpecialAccountEditComponent implements OnInit {
    // TODO add reset password option

    specialAccountForm: FormGroup;

    constructor(
        private specialAccountService: SpecialAccountService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.specialAccountForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            description: new FormControl('')
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.specialAccountService.getById(params['id']).subscribe((specialAccount: SpecialAccount) => {
                this.specialAccountForm.controls.username.setValue(specialAccount.connection.username);
                this.specialAccountForm.controls.description.setValue(specialAccount.description);
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const specialAccount = new SpecialAccount();
        Object.keys(this.specialAccountForm.controls).forEach(key => {
            if (this.specialAccountForm.get(key).dirty) {
                specialAccount[key] = this.specialAccountForm.get(key).value;
            }
        });
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
