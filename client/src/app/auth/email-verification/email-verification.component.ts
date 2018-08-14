import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
})

export class EmailVerificationComponent implements OnInit {

  passwordForm: FormGroup;
  token: String;
  email: String;
  userId: number;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email'] && params['emailToken'] && params['userId']) {
        this.email = params['email'];
        this.token = params['emailToken'];
        this.userId = params['userId'];
      } else {
        this.toasterService.showToaster('Problème dans la récupération de l\'adresse email ou du token');
        setTimeout(this.router.navigate(['/login']), 1000);
      }
    });
  }

  createForm(): void {
    this.passwordForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
    });
  }

  verifyEmail(): void {
    const password = this.passwordForm.get('password').value;
    this.authService.verifyEmail(this.userId, this.email, password, this.token).subscribe(() => {
      this.toasterService.showToaster('Enregistré, veuillez vous connecter');
      setTimeout(this.router.navigate(['/login']), 1000);
    });
  }
}
