import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToasterService } from '../../core/services/toaster.service';
import { Barman, Kommission } from '../../shared/models';
import { KommissionService } from '../../core/api-services/kommission.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  kommission: Kommission;

  constructor(private route: ActivatedRoute,
              private toasterService: ToasterService,
              private kommissionService: KommissionService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe((data: { kommission: Kommission }) => {
      this.kommission = data.kommission;
    });
  }

  async openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${this.kommission.name} ?`,
      },
    });

    const choice = await dialogRef.afterClosed().toPromise();
    if (choice) this.delete();
  }

  async delete() {
    await this.kommissionService.delete(this.kommission.id);
    this.toasterService.showToaster('Kommission supprimée');
    this.router.navigate(['/kommissions']);
  }

  getBarmen(active: boolean): Barman[] {
    if (this.kommission) return this.kommission.barmen.filter(b => (new Barman(b).isActive()) === active);
    return [];
  }
}
