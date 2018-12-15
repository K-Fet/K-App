import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/api-services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { validateEqual } from '../../shared/validators/equal.validator';

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
              private router: Router) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: new FormControl('', [Validators.required, validateEqual('passwordConfirmation', true)]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    });

    this.route.queryParams.subscribe((params) => {
      if (params['email'] && params['passwordToken']) {
        this.email = params['email'];
        this.token = params['passwordToken'];
      } else {
        this.toasterService.showToaster('Problème dans la récupération de l\'adresse email ou du token');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  async definePassword() {
    const password = this.passwordForm.get('password').value;
    await this.authService.definePassword(this.email, password, this.token, null);
    this.toasterService.showToaster('Mot de passe enregistré, veuillez vous connecter');
    this.router.navigate(['/auth/login']);
  }
}
