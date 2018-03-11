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
    specialAccountForm: FormGroup;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
        initial: Boolean,
    }> = [];

    constructor(
        private specialAccountService: SpecialAccountService,
        private permissionService: PermissionService,
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
                console.log(this.currentSpecialAccount);
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
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
        if (this.currentSpecialAccount.description !== this.specialAccountForm.get('description').value) {
            specialAccount.description = this.specialAccountForm.get('description').value;
        }
        if (this.currentSpecialAccount.connection.username !== this.specialAccountForm.get('username').value) {
            specialAccount.connection = {
                username: this.specialAccountForm.get('username').value
            };
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

    disable (): Boolean {
        const add = this.permissions.filter(permission => {
            return permission.isChecked === true && permission.initial !== permission.isChecked;
        });
        const remove = this.permissions.filter(permission => {
            return permission.isChecked === false && permission.initial !== permission.isChecked;
        });
        return this.currentSpecialAccount.connection.username === this.specialAccountForm.get('username').value
            && this.currentSpecialAccount.description === this.specialAccountForm.get('description').value
            && add.length === 0
            && remove.length === 0;
    }
}
