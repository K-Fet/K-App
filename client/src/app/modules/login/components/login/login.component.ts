import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../../../../shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  email: string;
  password: string;

  usernameFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private loginService: LoginService,
    private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    if (this.email && this.password) {
      const email: string = this.email;
      const password: string = this.password;

        this.loginService.login(email, password)
          .subscribe(() => {
              this.router.navigate(['/members']);
            }
          );
    }
    this.router.navigate(['/members']);
  }
}
