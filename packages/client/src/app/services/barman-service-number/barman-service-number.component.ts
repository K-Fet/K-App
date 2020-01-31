import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from '../../core/api-services/service.service';
import { Barman } from '../../shared/models';

interface BarmanServiceData {
  name: string;
  services: number;
}

@Component({
  selector: 'app-barman-service-number',
  templateUrl: './barman-service-number.component.html',
})
export class BarmanServiceNumberComponent implements OnInit {

  displayedColumns = ['name', 'services'];
  barmenData: MatTableDataSource<BarmanServiceData> = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.barmenData.paginator = this.paginator;
    this.barmenData.sort = this.sort;
  }

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.serviceService.getWeek().subscribe(async (week) => {
      const barmen = await this.serviceService.getAllActiveBarmen(week.start, week.end);
      this.barmenData.data = barmen.map(barman => ({
        name: (barman.account as Barman).nickName,
        services: (barman.account as Barman).services.length,
      }));
    });
  }
}
