import { Component, Inject } from '@angular/core';
import { Member } from '../_models/index';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './code-dialog.component.html',
})
export class CodeDialogComponent {

    code: number;
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder) {

        this.form = this.fb.group({
            codeFormControl: ['', [ Validators.required, Validators.pattern(/^[0-9]{4,}$/) ]]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
