import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './user-new.component.html',
})

export class UserNewComponent implements OnInit {
    email: string;
    firstName: string;
    lastName: string;
    school: string;

    emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    schoolFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private userService: UserService, private toasterService: ToasterService) {}
    ngOnInit(): void {

    }

    add() {
        const user = new User();
        user.email = this.email;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.school = this.school;
        this.userService.create(user).subscribe(() => {
            this.toasterService.showToaster('Utilisateur créé', 'Fermer');
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
