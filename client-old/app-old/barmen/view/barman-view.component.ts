import { Component, OnInit } from '@angular/core';
import { BarmanService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Barman } from '../../_models';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './barman-view.component.html',
})

export class BarmanViewComponent implements OnInit {

  barman: Barman = new Barman();

  constructor(
    private barmanService: BarmanService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.barman.id = params['id'];
      this.barmanService.getById(+this.barman.id).subscribe((barman) => {
        this.barman = barman;
      });
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
      this.router.navigate(['barmen']);
    });
  }
}