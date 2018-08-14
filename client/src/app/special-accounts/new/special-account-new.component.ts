import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Permission, SpecialAccount } from '../../_models';
import { PermissionService, SpecialAccountService, ToasterService } from '../../_services';
import { CodeDialogComponent } from '../../dialogs/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';

interface PermissionObj {
  permission: Permission;
  isChecked: Boolean;
}

@Component({
  templateUrl: './special-account-new.component.html',
})
export class SpecialAccountNewComponent implements OnInit {

  specialAccountForm: FormGroup;

  permissions: PermissionObj[] = [];

  constructor(
    private specialAccountService: SpecialAccountService,
    private permissionService: PermissionService,
    private toasterService: ToasterService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.createForms();
  }

  createForms(): void {
    this.specialAccountForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]),
      codeConfirmation: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.permissionService.getAll().subscribe((permissions) => {
      permissions.forEach((permission) => {
        this.permissions.push({
          permission,
          isChecked: false,
        });
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      width: '350px',
      data: { message: 'Ajout d\'un compte special. Votre code ?' },
    });

    dialogRef.afterClosed().subscribe((code) => {
      if (code) {
        this.add(code);
      }
    });
  }

  add(code: number): void {
    const specialAccount = this.prepareEditing();

    this.specialAccountService.create(specialAccount, code).subscribe(() => {
      this.toasterService.showToaster('Compte special ajouté');
      this.router.navigate(['/specialaccounts']);
    });
  }

  prepareEditing(): SpecialAccount {
    const specialAccount = new SpecialAccount();

    specialAccount.code = this.specialAccountForm.get('code').value;

    if (this.specialAccountForm.get('description').value !== '') {
      specialAccount.description = this.specialAccountForm.get('description').value;
    }

    specialAccount.connection = {
      email: this.specialAccountForm.get('email').value,
    };

    // Associations
    const add = this.permissions.filter((permission) => {
      return permission.isChecked === true;
    });
    if (add.length > 0) {
      specialAccount._embedded = {
        permissions: {
          add: add.map(perm => perm.permission.id),
        },
      };
    }
    return specialAccount;
  }

  disable(): Boolean {
    const add = this.permissions.filter((permission) => {
      return permission.isChecked === true;
    });

    if (!this.specialAccountForm.valid) {
      return true;
    }

    return this.specialAccountForm.get('email').value === ''
      || !this.codeMatch()
      || add.length === 0;
  }

  codeMatch(): Boolean {
    return (this.specialAccountForm.get('code').value ===
      this.specialAccountForm.get('codeConfirmation').value ||
      this.specialAccountForm.get('codeConfirmation').untouched);
  }
}
