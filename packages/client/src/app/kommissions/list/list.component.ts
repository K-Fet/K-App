import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Kommission } from '../../shared/models';
import { KommissionsService } from '../../core/api-services/kommissions.service';
import { ToasterService } from '../../core/services/toaster.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  kommissionsData: MatTableDataSource<Kommission>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private kommissionService: KommissionsService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.update();
  }

  async update() {
    const { rows: kommissions } = await this.kommissionService.list({ pageSize: 10000 });
    this.kommissionsData = new MatTableDataSource(kommissions);
    this.kommissionsData.paginator = this.paginator;
    this.kommissionsData.sort = this.sort;
  }

  edit(kommission: Kommission): void {
    this.router.navigate(['/kommissions', kommission._id, 'edit']);
  }

  async delete(kommission: Kommission) {
    await this.kommissionService.remove(kommission._id);
    this.toasterService.showToaster('Kommission supprimée');
    this.update();
  }

  view(kommission: Kommission): void {
    this.router.navigate(['/kommissions', kommission._id]);
  }

  async openConfirmationDialog(kommission: Kommission) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${kommission.name} ?`,
      },
    });

    const choice = await dialogRef.afterClosed().toPromise();
    if (choice) this.delete(kommission);
  }

  applyFilter(filterValue: string): void {
    this.kommissionsData.filter = filterValue.trim().toLowerCase();
  }
}
