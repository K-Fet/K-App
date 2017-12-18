import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member } from '../../_models/index';
import { MemberService } from '../../_services/member.service';
import { MemberDataSource } from './helpers/member-data-source';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatPaginator } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

    displayedColumns = ['lastName', 'firstName', 'school', 'action'];
    dataSource: MemberDataSource;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;

    constructor(private memberService: MemberService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.dataSource = new MemberDataSource(this.memberService, this.sort, this.paginator);
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
            this.dataSource = new MemberDataSource(this.memberService, this.sort, this.paginator);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

}

