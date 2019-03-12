import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>`,
})
export class ModalComponent<R = any> {

  @Input() config: MatDialogConfig;
  @ViewChild('content') content: TemplateRef<any>;

  private _dialogRef: MatDialogRef<any, R>;
  private _afterClosed = new Subject<R | undefined>();

  constructor(private dialog: MatDialog, private router: Router) {}

  openDialog(): void {
    this._dialogRef = this.dialog.open(this.content, this.config || { width: '250px' });

    this._dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate([{ outlets: { modal: null } }]);
      this._dialogRef = null;
      this._afterClosed.next(result);
    });
  }

  close(result?: R | undefined): void {
    if (this._dialogRef) this._dialogRef.close(result);
  }

  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  ngOnInit(): void {
    // Workaround https://github.com/angular/angular/issues/15634
    setTimeout(() => this.openDialog());
  }
}
