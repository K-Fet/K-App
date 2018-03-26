import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialAccount, Permission } from '../../_models';
import { ToasterService } from '../../_services';
import { SpecialAccountService, PermissionService } from '../../_services';
import { CodeDialogComponent } from '../../code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './special-account-new.component.html',
})

export class SpecialAccountNewComponent implements OnInit {

    specialAccountForm: FormGroup;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
    }> = [];

    constructor(private specialAccountService: SpecialAccountService,
        private permissionService: PermissionService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog) {
        this.createForms();
    }

    createForms() {
        this.specialAccountForm = this.fb.group({
            username: new FormControl('', [Validators.required, Validators.email]),
            code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]),
            codeConfirmation: new FormControl('', [Validators.required]),
            description: new FormControl(''),
        });
    }

    ngOnInit() {
        this.permissionService.getAll().subscribe(permissions => {
            permissions.forEach(permission => {
                this.permissions.push({
                    permission: permission,
                    isChecked: false,
                });
            });
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(CodeDialogComponent, {
            width: '350px',
            data: { message: 'Ajout d\'un compte special' }
        });

        dialogRef.afterClosed().subscribe(code => {
            if (code) {
                this.add(code);
            }
        });
    }

    add(code: Number) {
        const specialAccount = this.prepareEditing();

        this.specialAccountService.create(specialAccount, code).subscribe(() => {
                this.toasterService.showToaster('Compte special modifié');
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
            username: this.specialAccountForm.get('username').value
        };

        // Associations
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true;
        });
        if (add.length > 0) {
            specialAccount._embedded = {
                permissions: {
                    add: add.map(perm => perm.permission.id),
                }
            };
        }
        return specialAccount;
    }

    disable(): Boolean {
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true;
        });

        if (!this.specialAccountForm.valid) {
            return true;
        }

        return this.specialAccountForm.get('username').value === ''
            || !this.codeMatch()
            || add.length === 0;
    }

    codeMatch(): Boolean {
        return (this.specialAccountForm.get('code').value ===
            this.specialAccountForm.get('codeConfirmation').value ||
            this.specialAccountForm.get('codeConfirmation').untouched);
    }
}
