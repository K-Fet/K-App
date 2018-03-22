import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService, ToasterService } from '../_services';
import { Router } from '@angular/router';
import { ConnectedUser } from '../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
    user: ConnectedUser;
    loginForm: FormGroup;

    constructor(
        private loginService: LoginService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder) {
        this.createForm();
    }

    createForm() {
        this.loginForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    login() {
        this.loginService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
        .subscribe(() => {
            this.loginService.$currentUser.subscribe(user => {
                this.user = user;
                if (user && user.barman) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/members']);
                }
            });
        });
    }
}
