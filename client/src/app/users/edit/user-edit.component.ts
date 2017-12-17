import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './user-edit.component.html',
})

export class UserEditComponent implements OnInit {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    school: string;

    emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    schoolFormControl: FormControl = new FormControl('', [Validators.required]);

    private sub: any;

    constructor(
        private userService: UserService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.userService.getById(+this.id).subscribe(user => {
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.school = user.school;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const user = new User();
        user.id = +this.id;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.school = this.school;
        this.userService.update(user).subscribe(() => {
            this.toasterService.showToaster('Utilisateur modifié', 'Fermer');
            this.router.navigate(['/users']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
