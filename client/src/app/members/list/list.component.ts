import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { Member } from '../member.model';
import { MoleculerDataSource } from '../../shared/utils/moleculer-data-source';
import { MembersService } from '../members.service';
import { ToasterService } from '../../core/services/toaster.service';
import { CURRENT_SCHOOL_YEAR } from '../../constants';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'school', 'actions'];
  dataSource: MoleculerDataSource<Member>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private membersService: MembersService,
              private toasterService: ToasterService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource = new MoleculerDataSource<Member>(this.membersService);
    this.dataSource.load();
  }

  ngAfterViewInit(): void {
    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadMembersPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadMembersPage())).subscribe();
  }

  loadMembersPage() {
    this.dataSource.load({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  view(member: Member): void {
    this.router.navigate(['/core/members', member._id]);
  }

  edit(member: Member): void {
    this.router.navigate(['/core/members', member._id, 'edit']);
  }

  isRegistered(member: Member): boolean {
    return !!member.registrations.find(r => r.year === CURRENT_SCHOOL_YEAR);
  }

  async register(member: Member) {
    const registeredMember = await this.membersService.register(member._id);
    // Update fields
    Object.assign(member, registeredMember);
    this.toasterService.showToaster(`Adhérent inscrit pour l'année ${CURRENT_SCHOOL_YEAR}`);
  }
}
