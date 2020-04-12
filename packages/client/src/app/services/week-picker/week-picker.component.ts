import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../core/api-services/services.service';

@Component({
  selector: 'app-week-picker',
  templateUrl: './week-picker.component.html',
})

export class WeekPickerComponent implements OnInit {

  weekInterval: number;
  week: { start: Date; end: Date };

  constructor(private serviceService: ServicesService) {}

  ngOnInit(): void {
    this.serviceService.$weekInterval.subscribe((weekInterval) => {
      this.weekInterval = weekInterval;
    });
    this.serviceService.$week.subscribe((week) => {
      this.week = week;
    });
  }

  next(): void {
    this.serviceService.$weekInterval.next(this.weekInterval + 1);
  }

  previous(): void {
    this.serviceService.$weekInterval.next(this.weekInterval - 1);
  }
}
