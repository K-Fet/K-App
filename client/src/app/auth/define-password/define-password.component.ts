import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-define-password',
  templateUrl: './define-password.component.html',
})

export class DefinePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  token: string;
  email: string;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email'] && params['passwordToken']) {
        this.email = params['email'];
        this.token = params['passwordToken'];
      } else {
        this.toasterService.showToaster('Problème dans la récupération de l\'adresse email ou du token');
        this.router.navigate(['/login']);
      }
    });
  }

  createForm(): void {
    this.passwordForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    });
  }

  definePassword(): void {
    const password = this.passwordForm.get('password').value;
    this.authService.definePassword(this.email, password, this.token, null).subscribe(() => {
      this.toasterService.showToaster('Mot de passe enregistré, veuillez vous connecter');
      this.router.navigate(['/login']);
    });
  }
}
