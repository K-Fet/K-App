import { NgxPermissionsService } from 'ngx-permissions';
import { ConnectedUser } from './../../_models/ConnectedUser';
import { LoginService } from './../../_services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialAccount, Permission } from '../../_models';
import { ToasterService } from '../../_services';
import { SpecialAccountService, PermissionService } from '../../_services';
import { CodeDialogComponent } from '../../code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  templateUrl: './special-account-edit.component.html',
})

export class SpecialAccountEditComponent implements OnInit {

    currentSpecialAccount: SpecialAccount = new SpecialAccount({
        connection: {}
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
        private loginService: LoginService,
        private permissionService: PermissionService,
        private ngxPermissionsService: NgxPermissionsService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog
    ) {
        this.createForms();
    }

    createForms() {
        this.specialAccountForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            code: new FormControl(''),
            codeConfirmation: new FormControl(''),
            password: new FormControl(''),
        });
    }

    ngOnInit() {
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
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
        this.loginService.$currentUser.subscribe((user: ConnectedUser) => {
            this.currentUser = user;
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(CodeDialogComponent, {
            width: '350px',
            data: { message: 'Edition d\'un compte special' }
        });

        dialogRef.afterClosed().subscribe(code => {
            if (code) {
                this.edit(code);
            }
        });
    }

    edit(code: Number) {
        const specialAccount = this.prepareEditing();

        this.specialAccountService.update(specialAccount, code).subscribe(() => {
            this.toasterService.showToaster('Compte special modifié', 'Fermer');
            this.router.navigate(['/specialaccounts']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
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
                username: formValues.username
            };
        }
        if (formValues.password) {
            specialAccount.connection = {
                ...specialAccount.connection,
                password: formValues.password
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
                }
            };
        }
        if (remove.length > 0) {
            if (specialAccount._embedded) {
                specialAccount._embedded.permissions.remove = remove.map(perm => perm.permission.id);
            } else {
                specialAccount._embedded = {
                    permissions: {
                        remove: remove.map(perm => perm.permission.id),
                    }
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
        if (this.currentUser && this.currentUser.specialAccount) {
            return this.currentSpecialAccount.id === this.currentUser.specialAccount.id ? true : false;
        }
        return false;
    }

    codeFieldEnable(): Boolean {
        return (this.isMe() || this.ngxPermissionsService.getPermissions()['specialaccount:force-code-reset']) ? true : false;
    }

    codesMatch(): Boolean {
        if (this.specialAccountForm.get('code').value !== this.specialAccountForm.get('codeConfirmation').value) {
            this.specialAccountForm.get('code').setErrors({'incorrect': true});
            this.specialAccountForm.get('codeConfirmation').setErrors({'incorrect': true});
            return false;
        }
        this.specialAccountForm.get('code').setErrors(null);
        this.specialAccountForm.get('codeConfirmation').setErrors(null);
        return true;
    }
}
