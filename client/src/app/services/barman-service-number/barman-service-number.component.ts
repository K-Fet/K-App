import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../../_models';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BarmanService, ServiceService } from '../../_services';
import { forkJoin, Observable } from 'rxjs';

interface barmanServiceData {
  name: String;
  services: Number;
}

@Component({
  selector: 'app-barman-service-number',
  templateUrl: './barman-service-number.component.html',
})
export class BarmanServiceNumberComponent implements OnInit {

  displayedColumns = ['name', 'services'];
  barmenData: MatTableDataSource<barmanServiceData> = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.barmenData.paginator = this.paginator;
    this.barmenData.sort = this.sort;
  }

  constructor(private barmanService: BarmanService, private serviceService: ServiceService) { }

  ngOnInit(): void {
    let barmanDataTable: barmanServiceData[] = [];
    this.barmanService.getAll().subscribe((barmen) => {
      this.serviceService.getWeek().subscribe((week) => {
        const services$: Observable<Service[]>[] = [];
        barmen.filter(barman => barman.active).forEach((barman) => {
          services$.push(this.barmanService.getServices(barman.id, week.start, week.end));
        });
        forkJoin(services$).subscribe((services) => {
          barmanDataTable = [];
          barmen.forEach((barman) => {
            barmanDataTable.push({
              name: barman.nickname,
              services: services[barmen.indexOf(barman)].length,
            });
          });
          this.barmenData.data = barmanDataTable;
        });
      });
    });
  }
}
