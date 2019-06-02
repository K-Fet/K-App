import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Barman } from '../../shared/models';
import { BarmanService } from '../../core/api-services/barman.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['nickname', 'lastName', 'firstName', 'action'];
  barmenData: MatTableDataSource<Barman>;
  barmen: Barman[];
  activeFilter: boolean;
  oldFilter: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private barmanService: BarmanService,
              private router: Router,
              public mediaObserver: MediaObserver) {
  }

  async ngOnInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs' && this.displayedColumns.includes('lastName')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('lastName'), 1);
      } else if (!this.displayedColumns.includes('lastName')) {
        this.displayedColumns.splice(this.displayedColumns.indexOf('nickname') + 1, 0, 'lastName');
      }
    });
    const barmen = await this.barmanService.getAll();
    this.barmen = barmen;
    this.barmenData = new MatTableDataSource(barmen);
    this.barmenData.paginator = this.paginator;
    this.barmenData.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.barmenData.filter = filterValue.trim().toLowerCase();
  }

  applyActiveFilter(): void {
    this.oldFilter = false;
    const filteredBarmen = this.activeFilter ?
      this.barmen.filter(barman => new Barman(barman).isActive()) :
      this.barmen;
    this.barmenData = new MatTableDataSource(filteredBarmen);
    this.barmenData.paginator = this.paginator;
    this.barmenData.sort = this.sort;
  }

  applyOldFilter(): void {
    this.activeFilter = false;
    const filteredBarmen = this.oldFilter ?
      this.barmen.filter(barman => !(new Barman(barman).isActive())) :
      this.barmen;
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
