import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/index';
import { Day, ServiceService, Categories, ToasterService } from '../../_services/index';

@Component({
    selector: 'app-plan-my-services',
    templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

    myServices: Categories[];
    dayServices: Categories[];
    days: Day[] = new Array<Day>();

    constructor(private serviceService: ServiceService, private toasterService: ToasterService) {}

    ngOnInit() {
        this.serviceService.getPlanning().subscribe(days => {
            this.days = days;
            this.updateDayDetails(this.days[0]);
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    updateDayDetails(day: Day): void {
        this.days.map(currentDay => {
            if (currentDay === day) {
                currentDay.active = true;
            } else {
                currentDay.active = false;
            }
            return currentDay;
        });
        this.serviceService.getDayServiceDetails(day).subscribe(dayServices => {
            this.dayServices = dayServices;
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
