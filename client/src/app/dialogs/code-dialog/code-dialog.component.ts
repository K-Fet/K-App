import { Component, Inject } from '@angular/core';
import { Member } from '../../_models/index';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './code-dialog.component.html',
})
export class CodeDialogComponent {

    code: number;
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.form = new FormGroup({
            codeFormControl: new FormControl('', [Validators.required])
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
