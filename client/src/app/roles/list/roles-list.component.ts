import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Role } from '../../_models/index';
import { RoleService } from '../../_services/role.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

    displayedColumns = ['name', 'description'];
    rolesData: MatTableDataSource<Role>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private roleService: RoleService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.update();
    }

    update() {
        this.roleService.getAll().subscribe(roles => {
            this.rolesData = new MatTableDataSource(roles);
            this.rolesData.paginator = this.paginator;
            this.rolesData.sort = this.sort;
        });
    }

    edit(role: Role) {
        this.router.navigate(['/roles', role.id]);
    }

    delete(role: Role) {
        this.roleService.delete(role.id)
        .subscribe(() => {
            this.toasterService.showToaster('Role supprimé', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

}

