import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Member } from '../../_models/index';
import { MemberService } from '../../_services/member.service';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';
import { CodeDialogComponent } from '../../code-dialog/code-dialog.component';


@Component({
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

    displayedColumns = ['lastName', 'firstName', 'school', 'action'];
    membersData: MatTableDataSource<Member>;

    deletedMember: Member;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private memberService: MemberService,
        private toasterService: ToasterService,
        private router: Router,
        public dialog: MatDialog) { }

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

    delete(member: Member, code: number) {
        this.memberService.delete(member.id, code)
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
    openDialog(member: Member): void {
        this.deletedMember = member;
        const dialogRef = this.dialog.open(CodeDialogComponent, {
            width: '350px',
            data: { member }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(this.deletedMember, result);
            }
        });
    }
}
