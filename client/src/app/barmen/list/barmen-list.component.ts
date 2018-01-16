import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member, Barman } from '../../_models/index';
import { BarmanService } from '../../_services/index';
import { BarmanDataSource } from './helpers/barman-data-source';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatPaginator } from '@angular/material';
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
    dataSource: BarmanDataSource;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;

    constructor(private barmanService: BarmanService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.dataSource = new BarmanDataSource(this.barmanService, this.sort, this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
        });
    }

    view(barman: Barman) {
        this.router.navigate(['/barmen', barman.id]);
    }
    edit(barman: Barman) {
        this.router.navigate(['/barmen', barman.id, 'edit']);
    }
}

