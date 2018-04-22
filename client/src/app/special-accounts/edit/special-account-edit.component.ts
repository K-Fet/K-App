import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectedUser, Permission, SpecialAccount } from '../../_models';
import { AuthService, MeService, PermissionService, SpecialAccountService, ToasterService } from '../../_services';
import { CodeDialogComponent } from '../../dialogs/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './special-account-edit.component.html',
})

export class SpecialAccountEditComponent implements OnInit {

    currentSpecialAccount: SpecialAccount = new SpecialAccount({
        connection: {},
    });
    currentUser: ConnectedUser = new ConnectedUser();
    specialAccountForm: FormGroup;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
        initial: Boolean,
    }> = [];

    constructor(
        private specialAccountService: SpecialAccountService,
        private authService: AuthService,
        private permissionService: PermissionService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private meService: MeService
    ) {
        this.createForms();
    }

    createForms(): void {
        this.specialAccountForm = this.fb.group({
            username: new FormControl('', [Validators.required, Validators.email]),
            description: new FormControl(''),
            code: new FormControl('', [ Validators.pattern(/^[0-9]{4,}$/)]),
            codeConfirmation: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.permissionService.getAll().subscribe(permissions => {
            permissions.forEach(permission => {
                this.permissions.push({
                    permission: permission,
                    isChecked: false,
                    initial: false,
                });
            });
        });
        this.route.params.subscribe(params => {
            this.specialAccountService.getById(params['id']).subscribe((specialAccount: SpecialAccount) => {
                this.specialAccountForm.get('username').setValue(specialAccount.connection.username);
                this.specialAccountForm.get('description').setValue(specialAccount.description ? specialAccount.description : '');
                if (specialAccount.permissions) {
                    specialAccount.permissions.forEach(specialAccountPermission => {
                        if (this.permissions) {
                            this.permissions.filter(permission => {
                                return specialAccountPermission.id === permission.permission.id;
                            }).forEach(permission => {
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
            data: { message: 'Edition d\'un compte special' },
        });

        dialogRef.afterClosed().subscribe(code => {
            if (code) {
                this.edit(code);
            }
        });
    }

    edit(code: Number): void {
        const specialAccount = this.prepareEditing();
        if (this.isMe()) {
            this.meService.put(new ConnectedUser({ accountType: 'specialAccount', specialAccount: specialAccount })).subscribe(() => {
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
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true && permission.initial !== permission.isChecked;
        });
        const remove = this.permissions.filter(permission => {
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

    disable(): Boolean {
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true && permission.initial !== permission.isChecked;
        });
        const remove = this.permissions.filter(permission => {
            return permission.isChecked === false && permission.initial !== permission.isChecked;
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
            this.specialAccountForm.get('code').setErrors({ 'incorrect': true });
            this.specialAccountForm.get('codeConfirmation').setErrors({ 'incorrect': true });
            return false;
        }
        this.specialAccountForm.get('code').setErrors(null);
        this.specialAccountForm.get('codeConfirmation').setErrors(null);
        return true;
    }
}
