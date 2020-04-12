import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../core/services/toaster.service';
import { UsersService } from '../../core/api-services/users.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
})
export class EmailVerificationComponent implements OnInit {

  passwordForm: FormGroup;
  token: string;
  email: string;
  userId: number;

  constructor(private usersService: UsersService,
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

  async verifyEmail() {
    const password = this.passwordForm.get('password').value;
    await this.usersService.verifyEmail(this.userId, this.email, password, this.token);
    this.toasterService.showToaster('Enregistré, veuillez vous connecter');
    this.router.navigate(['/auth/login']);
  }
}
