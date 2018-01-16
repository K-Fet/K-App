import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Kommission } from '../../_models/index';
import { KommissionService } from '../../_services/kommission.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './kommissions-list.component.html',
  styleUrls: ['./kommissions-list.component.scss']
})
export class RoleListComponent implements OnInit {

    displayedColumns = ['name', 'description'];
    kommissionsData: MatTableDataSource<Kommission>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private kommissionService: KommissionService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.update();
    }

    update() {
        this.kommissionService.getAll().subscribe(kommissions => {
            this.kommissionsData = new MatTableDataSource(kommissions);
            this.kommissionsData.paginator = this.paginator;
            this.kommissionsData.sort = this.sort;
        });
    }

    edit(kommission: Kommission) {
        this.router.navigate(['/roles', kommission.id]);
    }

    delete(kommission: Kommission) {
        this.kommissionService.delete(kommission.id)
        .subscribe(() => {
            this.toasterService.showToaster('Kommission supprimée', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

}

