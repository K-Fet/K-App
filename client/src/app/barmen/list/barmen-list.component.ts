import { Component, OnInit, ViewChild } from '@angular/core';
import { Barman } from '../../_models';
import { BarmanService } from '../../_services';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
  templateUrl: './barmen-list.component.html',
  styleUrls: ['./barmen-list.component.scss'],
})
export class BarmenListComponent implements OnInit {

  displayedColumns = ['nickname', 'lastName', 'firstName', 'action'];
  barmenData: MatTableDataSource<Barman>;
  activeFilter: Boolean;
  barmen: Barman[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private barmanService: BarmanService,
              private router: Router,
              public media: ObservableMedia) {
  }

  ngOnInit(): void {
    this.barmanService.getAll().subscribe((barmen) => {
      this.barmen = barmen;
      this.barmenData = new MatTableDataSource(barmen);
      this.barmenData.paginator = this.paginator;
      this.barmenData.sort = this.sort;
    });
    this.media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs' && this.displayedColumns.includes('lastName')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('lastName'), 1);
      } else if (!this.displayedColumns.includes('lastName')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('nickname') + 1, 0, 'lastName');
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.barmenData.filter = filterValue.trim().toLowerCase();
  }

  applyActiveFilter(): void {
    const filteredBarmen = this.activeFilter ? this.barmen.filter(barman => !barman.leaveAt) : this.barmen;
    this.barmenData = new MatTableDataSource(filteredBarmen);
    this.barmenData.paginator = this.paginator;
    this.barmenData.sort = this.sort;
  }

  view(barman: Barman): void {
    this.router.navigate(['/barmen', barman.id]);
  }

  edit(barman: Barman): void {
    this.router.navigate(['/barmen', barman.id, 'edit']);
  }
}
