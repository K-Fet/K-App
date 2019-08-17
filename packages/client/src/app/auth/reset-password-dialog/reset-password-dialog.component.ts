import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './reset-password-dialog.component.html',
})
export class ResetPasswordDialogComponent {

  resetForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ResetPasswordDialogComponent>, private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    });
  }
}
