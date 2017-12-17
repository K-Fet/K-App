import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../_models/index';
import { UserService } from '../../_services/user.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

    displayedColumns = ['lastName', 'firstName', 'school'];
    dataSource: UsersDataSource;
    selection = new SelectionModel<string>(true, []);

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.dataSource = new UsersDataSource(this.userService, this.sort, this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
        });
    }

    isAllSelected(): boolean {
        if (!this.dataSource) { return false; }
        if (this.selection.isEmpty()) { return false; }

        if (this.filter.nativeElement.value) {
            return this.selection.selected.length === this.dataSource.renderedData.length;
        } else {
            return this.selection.selected.length === this.userService.data.length;
        }
      }

    masterToggle() {
        if (!this.dataSource) { return; }

        if (this.isAllSelected()) {
            this.selection.clear();
        } else if (this.filter.nativeElement.value) {
            // this.dataSource.renderedData.forEach(data => this.selection.select(data.id));
        } else {
            // this.userService.data.forEach(data => this.selection.select(data.id));
        }
    }

}

export class UsersDataSource extends DataSource<any> {
    filterChange = new BehaviorSubject('');
    get filter(): string { return this.filterChange.value; }
    set filter(filter: string) { this.filterChange.next(filter); }

    filteredData: User[] = [];
    renderedData: User[] = [];

    constructor(
        private userService: UserService,
        private sort: MatSort,
        private paginator: MatPaginator
    ) {
        super();
        this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    connect(): Observable<User[]> {
        const displayDataChanges = [
            this.userService.dataChange,
            this.sort.sortChange,
            this.filterChange,
            this.paginator.page,
        ];

        return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
          return this.userService.getAll();
        })
        .map(users => {
            // Filter data
            this.filteredData = users.slice().filter((item: User) => {
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

    sortData(data: User[]): User[] {
        if (!this.sort.active || this.sort.direction === '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number|string = '';
            let propertyB: number|string = '';

            switch (this.sort.active) {
                case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
                case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
                case 'school': [propertyA, propertyB] = [a.school, b.school]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect() {}
}
