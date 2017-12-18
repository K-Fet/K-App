import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ToasterService {

  constructor(private snackBar: MatSnackBar) {
  }

  showToaster(msg: string, action: string) {
    this.snackBar.open(msg, action, {
        duration: 2000,
    });
  }
}
