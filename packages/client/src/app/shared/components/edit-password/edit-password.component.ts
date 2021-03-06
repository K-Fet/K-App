import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/api-services/auth.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Router } from '@angular/router';
import { ConnectedUser } from '../../models';
import { getEditPasswordModel, getPasswordFromForm } from './edit-password.form-model';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
})
export class EditPasswordComponent implements OnInit {

  currentUser: ConnectedUser;
  formGroup: FormGroup;
  formModel: DynamicFormModel = getEditPasswordModel();

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private dynamicFormService: DynamicFormService,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.dynamicFormService.createFormGroup(this.formModel);
    this.authService.$currentUser.subscribe(user => this.currentUser = user);
  }

  async onNgSubmit() {
    const { oldPassword, newPassword } = getPasswordFromForm(this.formGroup);

    await this.authService.definePassword(this.currentUser.getConnection().email, newPassword, undefined, oldPassword);
    this.toasterService.showToaster('Modification du mot de passe enregistré');
    this.router.navigate(['/auth/login']);
  }
}
