import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordDialogComponent {

  resetForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ResetPasswordDialogComponent>, private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
