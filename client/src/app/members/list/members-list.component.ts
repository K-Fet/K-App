import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member } from '../../_models/index';
import { MemberService } from '../../_services/member.service';
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
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

    displayedColumns = ['lastName', 'firstName', 'school', 'action'];
    dataSource: UsersDataSource;
    selection = new SelectionModel<string>(true, []);

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;

    constructor(private memberService: MemberService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.dataSource = new UsersDataSource(this.memberService, this.sort, this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
        });
    }

    edit(member: Member) {
        this.router.navigate(['/members', member.id]);
    }

    delete(member: Member) {
        this.memberService.delete(member.id)
        .subscribe(() => {
            this.toasterService.showToaster('Utilisateur supprimé', 'Fermer');
            this.dataSource = new UsersDataSource(this.memberService, this.sort, this.paginator);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

}

export class UsersDataSource extends DataSource<any> {
    filterChange = new BehaviorSubject('');
    get filter(): string { return this.filterChange.value; }
    set filter(filter: string) { this.filterChange.next(filter); }

    filteredData: Member[] = [];
    renderedData: Member[] = [];

    constructor(
        private memberService: MemberService,
        private sort: MatSort,
        private paginator: MatPaginator
    ) {
        super();
        this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    connect(): Observable<Member[]> {
        const displayDataChanges = [
            this.memberService.dataChange,
            this.sort.sortChange,
            this.filterChange,
            this.paginator.page,
        ];

        return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
          return this.memberService.getAll();
        })
        .map(members => {
            // Filter data
            this.filteredData = members.slice().filter((item: Member) => {
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

    sortData(data: Member[]): Member[] {
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
