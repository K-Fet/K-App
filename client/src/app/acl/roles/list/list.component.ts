import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ObservableMedia } from '@angular/flex-layout';
import { ToasterService } from '../../../core/services/toaster.service';
import { RoleService } from '../../../core/api-services/role.service';
import { Role } from '../../../shared/models';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  rolesData: MatTableDataSource<Role>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private roleService: RoleService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog,
              private ngxPermissionsService: NgxPermissionsService,
              public media: ObservableMedia) {
  }

  ngOnInit(): void {
    this.update();
    if (!this.ngxPermissionsService.getPermissions()['role:write']) {
      this.displayedColumns = ['name'];
    }
  }

  update(): void {
    this.roleService.getAll().subscribe((roles) => {
      this.rolesData = new MatTableDataSource(roles);
      this.rolesData.paginator = this.paginator;
      this.rolesData.sort = this.sort;
    });
  }

  edit(role: Role): void {
    this.router.navigate(['/acl/roles', role.id, 'edit']);
  }

  delete(role: Role): void {
    this.roleService.delete(role.id)
      .subscribe(() => {
        this.toasterService.showToaster('Role supprimé');
        this.update();
      });
  }

  applyFilter(filterValue: string): void {
    this.rolesData.filter = filterValue.trim().toLowerCase();
  }

  openConfirmationDialog(role: Role): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Confirmation', message: `Confirmez-vous la suppression de ${role.name} ?` },
    });

    dialogRef.afterClosed().subscribe((choice) => {
      if (choice) {
        this.delete(role);
      }
    });
  }
}
