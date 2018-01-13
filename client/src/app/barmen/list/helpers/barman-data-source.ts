import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Barman } from '../../../_models/index';
import { BarmanService } from '../../../_services/barman.service';
import { MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

export class BarmanDataSource extends DataSource<any> {
    filterChange = new BehaviorSubject('');
    get filter(): string { return this.filterChange.value; }
    set filter(filter: string) { this.filterChange.next(filter); }

    filteredData: Barman[] = [];
    renderedData: Barman[] = [];

    constructor(
        private barmanService: BarmanService,
        private sort: MatSort,
        private paginator: MatPaginator
    ) {
        super();
        this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    connect(): Observable<Barman[]> {
        const displayDataChanges = [
            this.barmanService.dataChange,
            this.sort.sortChange,
            this.filterChange,
            this.paginator.page,
        ];

        return Observable.merge(...displayDataChanges)
        .startWith()
        .switchMap(() => {
            return this.barmanService.getAll();
        })
        .map(members => {
            // Filter data
            this.filteredData = members.slice().filter((item: Barman) => {
                const searchStr = (item.firstName + item.lastName).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            // Sort filtered data
            const sortedData = this.sortData(this.filteredData.slice());

            // Grab the page's slice of the filtered sorted data.
            const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);

            return this.renderedData;
        });
    }

    sortData(data: Barman[]): Barman[] {
        if (!this.sort.active || this.sort.direction === '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number|string = '';
            let propertyB: number|string = '';

            switch (this.sort.active) {
                // TODO implement others properties
                case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
                case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect() {}
}
