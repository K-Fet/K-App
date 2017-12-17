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
    firstName: string;
    lastName: string;
    school: string;

    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    schoolFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private userService: UserService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

    }

    add() {
        const user = new User();
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.school = this.school;
        this.userService.create(user).subscribe(() => {
            this.toasterService.showToaster('Utilisateur créé', 'Fermer');
            this.router.navigate(['/users'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
