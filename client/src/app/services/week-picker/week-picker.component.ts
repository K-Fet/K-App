import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../core/api-services/service.service';

@Component({
  selector: 'app-week-picker',
  templateUrl: './week-picker.component.html',
})

export class WeekPickerComponent implements OnInit {

  weekInterval: number;
  week: { start: Date, end: Date };

  ngOnInit(): void {
    this.serviceService.$weekInterval.subscribe((weekInterval) => {
      this.weekInterval = weekInterval;
    });
    this.serviceService.getWeek().subscribe((week) => {
      this.week = week;
    });
  }

  constructor(private serviceService: ServiceService) {}

  next(): void {
    this.serviceService.$weekInterval.next(+this.weekInterval + 1);
  }

  previous(): void {
    this.serviceService.$weekInterval.next(+this.weekInterval - 1);
  }
}
