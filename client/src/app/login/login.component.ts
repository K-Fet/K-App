import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../_services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JWT } from '../_models/JWT';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    email: string;
    password: string;
    returnUrl: string;

    emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
    passwordFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private loginService: LoginService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loginService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/members';
    }

    login() {
    const email: string = this.email;
    const password: string = this.password;
    this.loginService.login(email, password)
    .subscribe(jwt => {
        this.router.navigate(['/members']);
    });
    }
}
