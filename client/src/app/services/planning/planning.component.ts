import { Component, OnInit } from '@angular/core';
import { Day, ServiceService, ToasterService, Categories } from '../../_services/index';
import { Service } from '../../_models/index';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
})

export class PlanningComponent implements OnInit {

    days: Day[] = new Array<Day>();
    categories: Categories[];

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
        this.serviceService.getDayServiceDetails(day).subscribe(categories => {
            this.categories = categories;
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    ngOnInit() {
        this.serviceService.getPlanning().subscribe(days => {
            this.days = days;
            this.updateDayDetails(this.days[0]);
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
