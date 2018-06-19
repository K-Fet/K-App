import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../_services';
import { Day, Service } from '../../_models';
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
})

export class PlanningComponent implements OnInit {

  days: Day[] = [];
  dayServices: Service[];

  constructor(private serviceService: ServiceService) {}

  updateDayDetails(day: Day): void {
    this.days.map((currentDay) => {
      currentDay.active = currentDay === day;
      return currentDay;
    });
    this.dayServices = this.days.filter((currentDay) => {
      return currentDay.active === true;
    }).map((currentDay) => {
      currentDay.services.map((service) => {
        if (service.barmen && service.barmen.length === 0) {
          service.barmen = undefined;
        }
        return service;
      });
      return currentDay.services;
    })[0];
  }

  ngOnInit(): void {
    this.serviceService.getWeek().subscribe((week) => {
      this.serviceService.getPlanning(week.start, week.end).subscribe((days) => {
        if (days.length > 0) {
          this.days = days;
          const today = this.days.filter((day: Day) => {
            return moment().isSame(day.date, 'day');
          });
          this.updateDayDetails(today[0] || this.days[0]);
        } else {
          this.days = undefined;
          this.dayServices = undefined;
        }
      });
    });
  }

  getColor(service: Service): Object {
    return (service.barmen && service.barmen.length >= service.nbMax) ? 'red' : 'green';
  }
}
