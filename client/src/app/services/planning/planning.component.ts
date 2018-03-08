import { Component, OnInit } from '@angular/core';
import { ServiceService, ToasterService } from '../../_services/index';
import { Day, Service } from '../../_models/index';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
})

export class PlanningComponent implements OnInit {

    days: Day[] = new Array<Day>();
    dayServices: Service[];

    constructor(private serviceService: ServiceService, private toasterService: ToasterService) {}

    updateDayDetails(day: Day): void {
        this.days.map(currentDay => {
            if (currentDay === day) {
                currentDay.active = true;
            } else {
                currentDay.active = false;
            }
            return currentDay;
        });
        this.dayServices = this.days.filter(currentDay => {
            return currentDay.active === true;
        }).map(currentDay => {
            currentDay.services.map(service => {
                if (service.barmen && service.barmen.length === 0) {
                    service.barmen = undefined;
                }
                return service;
            });
            return currentDay.services;
        })[0];
    }

    ngOnInit() {
        this.serviceService.getWeek().subscribe(week => {
            this.serviceService.getPlanning(week.start, week.end).subscribe(days => {
                if (days.length > 0) {
                    this.days = days;
                    this.updateDayDetails(this.days[0]);
                } else {
                    this.days = undefined;
                    this.dayServices = undefined;
                }
            }, error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }
}
