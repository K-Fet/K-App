import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialAccountService } from '../special-account.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { getSpecialAccountFromForm, getSpecialAccountModel } from '../special-accounts.form-model';
import { CodeDialogComponent } from '../../../shared/dialogs/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';
import { PermissionService } from '../../../core/api-services/permission.service';
import { Permission } from '../../../shared/models';
import { PermissionsSelectorComponent } from '../../permissions-selector/permissions-selector.component';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;
  permissions: Permission[];

  @ViewChild(PermissionsSelectorComponent) permSelector: PermissionsSelectorComponent;

  constructor(private formService: DynamicFormService,
              private specialAccountService: SpecialAccountService,
              private permissionService: PermissionService,
              private toasterService: ToasterService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.permissionService.getAll().then(permissions => this.permissions = permissions);

    this.model = getSpecialAccountModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNgSubmit() {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: 'Création d\'un compte spécial' },
    });

    const code = await dialogRef.afterClosed().toPromise();
    if (code) this.doCreate(code);
  }

  async doCreate(code: number) {
    const newSpecialAccount = getSpecialAccountFromForm(
      this.formGroup,
      this.permSelector.selectedPermissions.map(p => p.id),
    );

    await this.specialAccountService.create(newSpecialAccount, code);
    this.toasterService.showToaster('Compte spécial créé');
    this.router.navigate(['/acl/special-accounts']);
  }
}
