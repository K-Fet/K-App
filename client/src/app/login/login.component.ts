import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../_services';
import { Router } from '@angular/router';
import { ConnectedUser } from '../_models';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
    user: ConnectedUser;
    loginForm: FormGroup;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private fb: FormBuilder) {
        this.createForm();
    }

    createForm(): void {
        this.loginForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
    }

    login(): void {
        this.loginService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
        .subscribe(() => {
            this.loginService.$currentUser.subscribe(user => {
                this.user = user;
                if (user && user.barman)
                    this.router.navigate(['/dashboard']);
                else
                    this.router.navigate(['/members']);
            });
        });
    }
}
