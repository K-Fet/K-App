import { Component, Inject } from '@angular/core';
import { Member } from '../_models/index';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './dialog.component.html',
})
export class DialogComponent {

    code: number;
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.form = new FormGroup({
            codeFormControl: new FormControl('', [Validators.required])
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
