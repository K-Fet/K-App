import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Barman } from '../../shared/models';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BarmanService } from '../../core/api-services/barman.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  barman: Barman;

  constructor(private route: ActivatedRoute,
              private barmanService: BarmanService,
              private toasterService: ToasterService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe((data: { barman: Barman }) => {
      this.barman = data.barman;
    });
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${this.barman.nickname} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((choice) => {
      if (choice) {
        this.delete();
      }
    });
  }

  delete(): void {
    this.barmanService.delete(this.barman.id).subscribe(() => {
      this.toasterService.showToaster('Barman supprimé');
      this.router.navigate(['/barmen']);
    });
  }
}
