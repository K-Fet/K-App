import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>`,
})
export class ModalComponent {

  @Input() config: MatDialogConfig;
  @ViewChild('content') content: TemplateRef<any>;

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private router: Router) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(this.content, this.config || { width: '250px' });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate([{ outlets: { modal: null } }]);
      this.modalClose.next(result);
    });
  }

  ngOnInit(): void {
    // Workaround https://github.com/angular/angular/issues/15634
    setTimeout(() => this.openDialog());
  }
}
