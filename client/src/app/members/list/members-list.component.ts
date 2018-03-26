import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MemberService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { CodeDialogComponent } from '../../code-dialog/code-dialog.component';
import { NgxPermissionsService } from 'ngx-permissions';

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
        public dialog: MatDialog,
        private ngxPermissionsService: NgxPermissionsService) { }

    ngOnInit(): void {
        this.update();
        if (!this.ngxPermissionsService.getPermissions()['specialaccount:write'])
            this.displayedColumns = ['lastName', 'firstName', 'school'];
    }

    update(): void {
        this.memberService.getAll()
        .subscribe(members => {
            this.membersData = new MatTableDataSource(members);
            this.membersData.paginator = this.paginator;
            this.membersData.sort = this.sort;
        });
    }

    edit(member: Member): void {
        this.router.navigate(['/members', member.id]);
    }

    delete(member: Member, code: number): void {
        this.memberService.delete(member.id, code)
        .subscribe(() => {
            this.toasterService.showToaster('Adhérent supprimé');
            this.update();
        });
    }

    applyFilter(filterValue: string): void {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.membersData.filter = filterValue;
    }

    openDialog(member: Member): void {
        this.deletedMember = member;
        const dialogRef = this.dialog.open(CodeDialogComponent, {
            width: '350px',
            data: { message: `Suppression de ${member.firstName} ${member.lastName}` }
        });

        dialogRef.afterClosed()
        .subscribe(result => {
            if (result)
                this.delete(this.deletedMember, result);
        });
    }
}
