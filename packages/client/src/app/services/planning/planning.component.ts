import { Component, OnInit } from '@angular/core';
import { Day, Service } from '../../shared/models';
import { ServiceService } from '../../core/api-services/service.service';
import { isSameDay } from 'date-fns';

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
      return currentDay.active;
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
    this.serviceService.getWeek().subscribe(async (week) => {
      const days = await this.serviceService.getPlanning(week.start, week.end);
      if (days.length > 0) {
        this.days = days;
        const today = this.days.filter((day: Day) => {
          return isSameDay(day.date, new Date());
        });
        this.updateDayDetails(today[0] || this.days[0]);
      } else {
        this.days = undefined;
        this.dayServices = undefined;
      }
    });
  }

  getColor(service: Service): string {
    return (service.barmen && service.barmen.length >= service.nbMax) ? 'red' : 'green';
  }
}
