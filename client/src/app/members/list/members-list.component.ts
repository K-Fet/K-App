import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member } from '../../_models/index';
import { MemberService } from '../../_services/member.service';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

    displayedColumns = ['lastName', 'firstName', 'school', 'action'];
    membersData: MatTableDataSource<Member>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private memberService: MemberService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.update();
    }

    update() {
        this.memberService.getAll().subscribe(members => {
            this.membersData = new MatTableDataSource(members);
            this.membersData.paginator = this.paginator;
            this.membersData.sort = this.sort;
        });
    }

    edit(member: Member) {
        this.router.navigate(['/members', member.id]);
    }

    delete(member: Member) {
        this.memberService.delete(member.id)
        .subscribe(() => {
            this.toasterService.showToaster('Adhérent supprimé', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.membersData.filter = filterValue;
    }

}

