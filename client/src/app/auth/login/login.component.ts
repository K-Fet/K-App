import { ResetPasswordDialogComponent } from './../../dialogs/reset-password/reset-password.component';
import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { ConnectedUser } from '../../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
    user: ConnectedUser;
    loginForm: FormGroup;

    constructor (private authService: AuthService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder,
        private matDialog: MatDialog) {
        this.createForm();
    }

    createForm() {
        this.loginForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    login() {
        this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
        .subscribe(() => {
            this.authService.$currentUser.subscribe(user => {
                this.user = user;
                if (user && user.barman) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/members']);
                }
            });
        });
    }

    openDialog() {
        const dialogRef = this.matDialog.open(ResetPasswordDialogComponent);

        dialogRef.afterClosed().subscribe(username => {
            if (username) {
                this.authService.resetPassword(username).subscribe(() => {
                    this.toasterService.showToaster('Réinitialisation enregistrée. Merci de consulter votre boite mail');
                });
            }
        });
    }
}
