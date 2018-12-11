import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/api-services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
})
export class EmailVerificationComponent implements OnInit {

  passwordForm: FormGroup;
  token: string;
  email: string;
  userId: number;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
    });

    this.route.queryParams.subscribe((params) => {
      if (params['email'] && params['emailToken'] && params['userId']) {
        this.email = params['email'];
        this.token = params['emailToken'];
        this.userId = params['userId'];
      } else {
        this.toasterService.showToaster('Problème dans la récupération de l\'adresse email ou du token');
        this.router.navigate(['/auth/ogin']);
      }
    });
  }

  verifyEmail(): void {
    const password = this.passwordForm.get('password').value;
    this.authService.verifyEmail(this.userId, this.email, password, this.token).subscribe(() => {
      this.toasterService.showToaster('Enregistré, veuillez vous connecter');
      this.router.navigate(['/auth/login']);
    });
  }
}
