import { Component, OnInit, ViewChild } from '@angular/core';
import { Kommission } from '../../_models';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { KommissionService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  templateUrl: './kommissions-list.component.html',
  styleUrls: ['./kommissions-list.component.scss'],
})
export class KommissionsListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  kommissionsData: MatTableDataSource<Kommission>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog,
              private ngxPermissionsService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionsService.getPermissions()['kommission:write']) {
      this.displayedColumns = ['name', 'description'];
    }
    this.media.subscribe((change: MediaChange) => {
      if ((change.mqAlias === 'sm' || change.mqAlias === 'xs') && this.displayedColumns.includes('description')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('description'), 1);
      } else if (!this.displayedColumns.includes('description') && change.mqAlias !== 'xs' && change.mqAlias !== 'sm') {
        this.displayedColumns.splice(this.displayedColumns.indexOf('name') + 1, 0, 'description');
      }
    });
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
