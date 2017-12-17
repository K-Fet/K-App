import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../_services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    username: string;
    password: string;
    returnUrl: string;

    usernameFormControl: FormControl = new FormControl('', [Validators.required]);
    passwordFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private loginService: LoginService,
        private toasterService: ToasterService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/members';
    }

    login() {
        const username: string = this.username;
        const password: string = this.password;
        this.loginService.login(username, password)
        .subscribe(jwt => {
            if (jwt) {
                localStorage.setItem('currentUser', JSON.stringify(jwt));
            }
            this.router.navigate([this.returnUrl]);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
