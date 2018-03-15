import { Component, Inject } from '@angular/core';
import { Member } from '../../_models/index';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup, EmailValidator, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-reset-password-dialog',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordDialogComponent {

    resetForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<ResetPasswordDialogComponent>, private fb: FormBuilder) {
        this.resetForm = this.fb.group({
            usernameFormControl: new FormControl('', [Validators.required, Validators.email])
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
