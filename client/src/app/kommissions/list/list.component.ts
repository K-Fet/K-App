import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Kommission } from '../../shared/models';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  kommissionsData: MatTableDataSource<Kommission>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.update();
  }

  update(): void {
    this.kommissionService.getAll().subscribe((kommissions) => {
      this.kommissionsData = new MatTableDataSource(kommissions);
      this.kommissionsData.paginator = this.paginator;
      this.kommissionsData.sort = this.sort;
    });
  }

  edit(kommission: Kommission): void {
    this.router.navigate(['/kommissions', kommission.id, 'edit']);
  }

  delete(kommission: Kommission): void {
    this.kommissionService.delete(kommission.id)
      .subscribe(() => {
        this.toasterService.showToaster('Kommission supprimée');
        this.update();
      });
  }

  view(kommission: Kommission): void {
    this.router.navigate(['/kommissions', kommission.id]);
  }

  openConfirmationDialog(kommission: Kommission): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Confirmez-vous la suppression de ${kommission.name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((choice) => {
      if (choice) {
        this.delete(kommission);
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.kommissionsData.filter = filterValue.trim().toLowerCase();
  }
}
