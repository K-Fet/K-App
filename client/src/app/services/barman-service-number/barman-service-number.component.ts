import { Component, OnInit, ViewChild } from '@angular/core';
import { Barman } from '../../_models';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BarmanService, ServiceService } from '../../_services';

@Component({
  selector: 'app-barman-service-number',
  templateUrl: './barman-service-number.component.html',
})
export class BarmanServiceNumberComponent implements OnInit {

  displayedColumns = ['nickname', 'number'];
  barmenData: MatTableDataSource<Barman>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private barmanService: BarmanService, private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.serviceService.getWeek().subscribe((week) => {
      this.barmanService.getAll().subscribe((barmen) => {
        barmen.filter(barman => barman.active).map((barman) => {
          this.barmanService.getServices(barman.id, week.start, week.end).subscribe((services) => {
            barman.services = services;
          });
          return barman;
        });
        this.barmenData = new MatTableDataSource(barmen);
        this.barmenData.paginator = this.paginator;
        this.barmenData.sort = this.sort;
      });
    });
  }
}
