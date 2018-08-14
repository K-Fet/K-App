import { ResetPasswordDialogComponent } from '../../dialogs/reset-password/reset-password.component';
import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { ConnectedUser } from '../../_models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
  user: ConnectedUser;
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private router: Router,
              private fb: FormBuilder,
              private matDialog: MatDialog) {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false),
    });
  }

  login(): void {
    const { email, password, rememberMe } = this.loginForm.value;
    const rememberMeDay = rememberMe ? environment.JWT_DAY_EXP_LONG : environment.JWT_DAY_EXP;
    this.authService.login(email, password, rememberMeDay)
      .subscribe(() => {
        this.authService.$currentUser.subscribe((user) => {
          this.user = user;
          this.router.navigate(['/']);
        });
      });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(ResetPasswordDialogComponent);

    dialogRef.afterClosed().subscribe((email) => {
      if (email) {
        this.authService.resetPassword(email).subscribe(() => {
          this.toasterService.showToaster('Réinitialisation enregistrée. Merci de consulter votre boite mail');
        });
      }
    });
  }
}
