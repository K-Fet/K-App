import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectedUser, Permission, SpecialAccount } from '../../_models';
import {
  AuthService,
  MeService,
  PermissionService,
  SpecialAccountService,
  ToasterService,
} from '../../_services';
import { CodeDialogComponent } from '../../dialogs/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';

interface PermissionObj {
  permission: Permission;
  isChecked: Boolean;
  initial: Boolean;
}

@Component({
  templateUrl: './special-account-edit.component.html',
})
export class SpecialAccountEditComponent implements OnInit {

  currentSpecialAccount: SpecialAccount = new SpecialAccount({
    connection: {},
  });
  currentUser: ConnectedUser = new ConnectedUser();
  specialAccountForm: FormGroup;
  passwordForm: FormGroup;

  permissions: PermissionObj[] = [];

  constructor(
    private specialAccountService: SpecialAccountService,
    private authService: AuthService,
    private permissionService: PermissionService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private meService: MeService,
  ) {
    this.createForms();
  }

  createForms(): void {
    this.specialAccountForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl(''),
      code: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      codeConfirmation: new FormControl(''),
    });

    function passwordMatchValidator(g: FormGroup): ValidationErrors | null {
      return g.get('newPassword').value === g.get('newPasswordConfirm').value
        ? null : { passwordMismatch: true };
    }

    function passwordRegExValidator(g: FormGroup): ValidationErrors | null {
      return g.get('newPassword').value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
        ? null : { weakPassword: true };
    }

    this.passwordForm = new FormGroup(
      {
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        newPasswordConfirm: new FormControl('', [Validators.required]),
      },
      [passwordMatchValidator, passwordRegExValidator],
    );
  }

  ngOnInit(): void {
    this.permissionService.getAll().subscribe((permissions) => {
      permissions.forEach((permission) => {
        this.permissions.push({
          permission,
          isChecked: false,
          initial: false,
        });
      });
    });
    this.route.params.subscribe((params) => {
      this.specialAccountService.getById(params['id']).subscribe((specialAccount: SpecialAccount) => {
        this.specialAccountForm.get('username').setValue(specialAccount.connection.username);
        this.specialAccountForm.get('description')
          .setValue(specialAccount.description ? specialAccount.description : '');

        if (specialAccount.permissions) {
          specialAccount.permissions.forEach((specialAccountPermission) => {
            if (this.permissions) {
              this.permissions.filter((permission) => {
                return specialAccountPermission.id === permission.permission.id;
              }).forEach((permission) => {
                permission.isChecked = true;
                permission.initial = true;
              });
            }
          });
        }
        this.currentSpecialAccount = specialAccount;
      });
    });
    this.authService.$currentUser.subscribe((user: ConnectedUser) => {
      this.currentUser = user;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: `Edition du compte special ${this.currentSpecialAccount.connection.username}` },
    });

    dialogRef.afterClosed().subscribe((code) => {
      if (code) {
        this.edit(code);
      }
    });
  }

  edit(code: number): void {
    const specialAccount = this.prepareEditing();
    if (this.isMe()) {
      const connectedUser = new ConnectedUser({
        specialAccount,
        accountType: 'specialAccount',
      });
      this.meService.put(connectedUser, code).subscribe(() => {
        this.toasterService.showToaster('Modification(s) enregistrée(s)');
        this.router.navigate(['/specialaccounts']);
        this.authService.me().subscribe();
      });
    } else {
      this.specialAccountService.update(specialAccount, code).subscribe(() => {
        this.toasterService.showToaster('Compte special modifié');
        this.router.navigate(['/specialaccounts']);
      });
    }
  }

  prepareEditing(): SpecialAccount {
    const specialAccount = new SpecialAccount({
      id: this.currentSpecialAccount.id,
    });

    const formValues = this.specialAccountForm.value;

    // Simple field
    if (this.currentSpecialAccount.description !== formValues.description) {
      specialAccount.description = formValues.description;
    }
    if (this.currentSpecialAccount.connection.username !== formValues.username) {
      specialAccount.connection = {
        username: formValues.username,
      };
    }
    if (formValues.code) {
      specialAccount.code = formValues.code;
    }

    // Associations
    const add = this.permissions.filter((permission) => {
      return permission.isChecked === true && permission.initial !== permission.isChecked;
    });
    const remove = this.permissions.filter((permission) => {
      return permission.isChecked === false && permission.initial !== permission.isChecked;
    });
    if (add.length > 0) {
      specialAccount._embedded = {
        permissions: {
          add: add.map(perm => perm.permission.id),
        },
      };
    }
    if (remove.length > 0) {
      if (specialAccount._embedded) {
        specialAccount._embedded.permissions.remove = remove.map(perm => perm.permission.id);
      } else {
        specialAccount._embedded = {
          permissions: {
            remove: remove.map(perm => perm.permission.id),
          },
        };
      }
    }
    return specialAccount;
  }

  updatePassword(): void {
    this.authService.definePassword(
      this.currentSpecialAccount.connection.username,
      this.passwordForm.value.newPassword,
      null,
      this.passwordForm.value.oldPassword).subscribe(() => {
        this.toasterService.showToaster('Modification du mot de passe enregistré');
        this.router.navigate(['/login']);
      },
    );
  }

  getErrorMessage(): String {
    if (this.passwordForm.hasError('passwordMismatch')) {
      return 'Les nouveaux mots de passe ne correspondent pas.';
    }

    if (this.passwordForm.hasError('weakPassword')) {
      return 'Le nouveau mot de passe doit contenir au moins 8 caractères ' +
        'et doit avoir 1 minuscule, 1 majuscule et 1 chiffre.';
    }
    return '';
  }

  disable(): Boolean {
    const add = this.permissions.filter((permission) => {
      return permission.isChecked && permission.initial !== permission.isChecked;
    });
    const remove = this.permissions.filter((permission) => {
      return !permission.isChecked && permission.initial !== permission.isChecked;
    });
    if (!this.specialAccountForm.valid) {
      return true;
    }
    return this.currentSpecialAccount.connection.username === this.specialAccountForm.get('username').value
      && this.currentSpecialAccount.description === this.specialAccountForm.get('description').value
      && add.length === 0
      && remove.length === 0
      && this.specialAccountForm.get('code').value === '';
  }

  isMe(): Boolean {
    return this.currentUser && this.currentUser.specialAccount
      && this.currentSpecialAccount.id === this.currentUser.specialAccount.id;
  }

  codesMatch(): Boolean {
    if (this.specialAccountForm.get('code').value !== this.specialAccountForm.get('codeConfirmation').value) {
      this.specialAccountForm.get('code').setErrors({ incorrect: true });
      this.specialAccountForm.get('codeConfirmation').setErrors({ incorrect: true });
      return false;
    }
    this.specialAccountForm.get('code').setErrors(null);
    this.specialAccountForm.get('codeConfirmation').setErrors(null);
    return true;
  }
}
