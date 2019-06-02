import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { SpecialAccountService } from '../special-account.service';
import { ConnectedUser, Permission, SpecialAccount } from '../../../shared/models';
import { getSpecialAccountFromForm, getSpecialAccountModel } from '../special-accounts.form-model';
import { CodeDialogComponent } from '../../../shared/dialogs/code-dialog/code-dialog.component';
import { AuthService } from '../../../core/api-services/auth.service';
import { MeService } from '../../../core/api-services/me.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { PermissionService } from '../../../core/api-services/permission.service';
import { PermissionsSelectorComponent } from '../../permissions-selector/permissions-selector.component';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalSpecialAccount: SpecialAccount;
  connectedUser: ConnectedUser;

  permissions: Permission[] = [];

  @ViewChild(PermissionsSelectorComponent, { static: true }) permSelector: PermissionsSelectorComponent;

  constructor(private formService: DynamicFormService,
              private authService: AuthService,
              private meService: MeService,
              private permissionService: PermissionService,
              private specialAccountService: SpecialAccountService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.authService.$currentUser.subscribe(user => this.connectedUser = user);
    this.formGroup = this.formService.createFormGroup([]);

    this.permissionService.getAll().then(permissions => this.permissions = permissions);

    this.route.data.subscribe((data: { specialAccount: SpecialAccount }) => {
      this.originalSpecialAccount = data.specialAccount;
      this.model = getSpecialAccountModel(this.originalSpecialAccount);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  isMe(): boolean {
    if (!this.connectedUser || !this.originalSpecialAccount || !this.originalSpecialAccount.connection) return false;
    const { id: connectedId } = this.connectedUser.getConnection();
    const { id: specialAccountId } = this.originalSpecialAccount.connection;
    return connectedId === specialAccountId;
  }

  async onNgSubmit() {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: `Edition du compte special ${this.originalSpecialAccount.connection.email}` },
    });

    const code = await dialogRef.afterClosed().toPromise();
    if (code) this.doUpdate(code);
  }

  async doUpdate(code: number) {
    const updateSpecialAccount = getSpecialAccountFromForm(
      this.formGroup,
      this.permSelector.selectedPermissions.map(p => p.id),
      this.originalSpecialAccount,
    );

    if (this.isMe()) {
      await this.meService.put(
        new ConnectedUser({ accountType: 'SpecialAccount', specialAccount: updateSpecialAccount }),
        code,
      );
      this.toasterService.showToaster('Modification(s) enregistrée(s)');
      this.router.navigate(['/home']);
      this.authService.me();
    } else {
      await this.specialAccountService.update(updateSpecialAccount, code);
      this.toasterService.showToaster('Compte spécial modifié');
      this.router.navigate(['/acl/special-accounts']);
    }
  }
}
