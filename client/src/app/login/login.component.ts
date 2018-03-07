import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../_services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../_services/toaster.service';
import { ConnectedUser } from '../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
    username: string;
    password: string;
    returnUrl: string;
    user: ConnectedUser;

    usernameFormControl: FormControl = new FormControl('', [Validators.required]);
    passwordFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private loginService: LoginService,
        private toasterService: ToasterService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    login() {
        const username: string = this.username;
        const password: string = this.password;
        this.loginService.login(username, password)
        .subscribe(() => {
            this.loginService.currentUser.subscribe(user => {
                this.user = user;
                if (user && user.barman) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/members']);
                }
            });
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
