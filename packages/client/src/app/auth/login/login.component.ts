import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import {
  DynamicCheckboxModel,
  DynamicFormModel,
  DynamicFormService,
  DynamicInputModel,
} from '@k-fet/ng-dynamic-forms-core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/api-services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { FormGroup } from '@angular/forms';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';
import { UsersService } from '../../core/api-services/users.service';

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
              private usersService: UsersService,
              private toasterService: ToasterService,
              private router: Router,
              private formService: DynamicFormService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  async login() {
    const { email, password, rememberMe } = this.formGroup.value;
    const rememberMeDay = rememberMe ? environment.JWT_DAY_EXP_LONG : environment.JWT_DAY_EXP;

    await this.authService.login(email, password, rememberMeDay);
    this.router.navigate(['/']);
  }

  async openDialog() {
    const dialogRef = this.matDialog.open(ResetPasswordDialogComponent);

    const email = await dialogRef.afterClosed().toPromise();
    if (email) {
      await this.usersService.resetPassword(email);
      this.toasterService.showToaster('Réinitialisation enregistrée. Merci de consulter votre boite mail');
    }
  }
}
