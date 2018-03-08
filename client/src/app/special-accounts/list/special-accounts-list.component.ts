import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SpecialAccount } from '../../_models/index';
import { SpecialAccountService } from '../../_services/index';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './special-accounts-list.component.html',
})
export class SpecialAccountListComponent implements OnInit {

    displayedColumns = ['Username', 'Description', 'action'];
    specialAccountData: MatTableDataSource<SpecialAccount>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private specialAccountService: SpecialAccountService,
        private toasterService: ToasterService,
        private router: Router) {
    }

    ngOnInit() {
        this.update();
    }

    update() {
        this.specialAccountService.getAll().subscribe(specialaccounts => {
            this.specialAccountData = new MatTableDataSource(specialaccounts);
            this.specialAccountData.paginator = this.paginator;
            this.specialAccountData.sort = this.sort;
        });
    }

    edit(specialAccount: SpecialAccount) {
        this.router.navigate(['/roles', specialAccount.id]);
    }

    delete(specialAccount: SpecialAccount) {
        // TODO implement code dialog
        const code = null;
        this.specialAccountService.delete(specialAccount.id, code)
        .subscribe(() => {
            this.toasterService.showToaster('Compte spécial supprimé', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.specialAccountData.filter = filterValue;
    }
}
