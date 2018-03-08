import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialAccount } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { SpecialAccountService } from '../../_services/index';

@Component({
  templateUrl: './special-account-new.component.html',
})

export class SpecialAccountNewComponent implements OnInit {
    username: string;
    password: string;
    description: string;

    usernameFormControl: FormControl = new FormControl('', [Validators.required]);
    passwordFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('');

    constructor(private specialAccountService: SpecialAccountService,
        private toasterService: ToasterService,
        private router: Router) {}

    ngOnInit(): void {
    }

    add() {
        const specialAccount = new SpecialAccount();
        specialAccount.description = this.description;
        // TODO implement code dialog
        const code = null;
        this.specialAccountService.create(specialAccount, code).subscribe(() => {
            this.toasterService.showToaster('Compte spécial créé', 'Fermer');
            this.router.navigate(['/specialaccounts'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
