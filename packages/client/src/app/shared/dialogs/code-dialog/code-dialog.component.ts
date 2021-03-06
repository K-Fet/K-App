import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
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
      codeFormControl: ['', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
