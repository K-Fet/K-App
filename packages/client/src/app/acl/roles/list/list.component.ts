import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private roleService: RoleService,
              private toasterService: ToasterService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.update();
  }

  async update() {
    const { rows: roles } = await this.roleService.list({ pageSize: 1000 });
    this.rolesData = new MatTableDataSource(roles);
    this.rolesData.paginator = this.paginator;
    this.rolesData.sort = this.sort;
  }

  edit(role: Role): void {
    this.router.navigate(['/acl/roles', role._id, 'edit']);
  }

  async delete(role: Role) {
    await this.roleService.remove(role._id);
    this.toasterService.showToaster('Role supprimé');
    this.update();
  }

  applyFilter(filterValue: string): void {
    this.rolesData.filter = filterValue.trim().toLowerCase();
  }

  async openConfirmationDialog(role: Role) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Confirmation', message: `Confirmez-vous la suppression de ${role.name} ?` },
    });

    const choice = await dialogRef.afterClosed().toPromise();
    if (choice) this.delete(role);
  }
}
