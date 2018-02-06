import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member, Barman } from '../../_models/index';
import { BarmanService } from '../../_services/index';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './barmen-list.component.html',
  styleUrls: ['./barmen-list.component.scss']
})
export class BarmenListComponent implements OnInit {

    displayedColumns = ['nickname', 'lastName', 'firstName', 'action'];
    barmenData: MatTableDataSource<Barman>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private barmanService: BarmanService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.barmanService.getAll().subscribe(barmen => {
            this.barmenData = new MatTableDataSource(barmen);
            this.barmenData.paginator = this.paginator;
            this.barmenData.sort = this.sort;
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.barmenData.filter = filterValue;
    }

    view(barman: Barman) {
        this.router.navigate(['/barmen', barman.id]);
    }
    edit(barman: Barman) {
        this.router.navigate(['/barmen', barman.id, 'edit']);
    }
}

