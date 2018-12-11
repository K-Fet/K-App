import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {
  DynamicCheckboxModel,
  DynamicFormModel,
  DynamicFormService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/api-services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { FormGroup } from '@angular/forms';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';

const LOGIN_FORM_MODEL: DynamicFormModel = [
  new DynamicInputModel({
    id: 'email',
    label: 'Email',
    validators: { required: null },
  }),
  new DynamicInputModel({
    id: 'password',
    label: 'Mot de passe',
    inputType: 'password',
    validators: { required: null },
  }),
  new DynamicCheckboxModel({
    id: 'rememberMe',
    label: 'Se souvenir de moi',
    value: false,
  }),
];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  formModel: DynamicFormModel = LOGIN_FORM_MODEL;
  formGroup: FormGroup;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private router: Router,
              private formService: DynamicFormService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  login(): void {
    const { email, password, rememberMe } = this.formGroup.value;
    const rememberMeDay = rememberMe ? environment.JWT_DAY_EXP_LONG : environment.JWT_DAY_EXP;

    this.authService.login(email, password, rememberMeDay).subscribe(() => {
      this.router.navigate(['/']);
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
