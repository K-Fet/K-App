import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/index';
import { Day, ServiceService, Categories, ToasterService, BarmanService } from '../../_services/index';

@Component({
    selector: 'app-plan-my-services',
    templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

    myServices: Categories[];
    dayServices: Categories[];
    days: Day[] = new Array<Day>();

    constructor(private serviceService: ServiceService,
        private barmanService: BarmanService,
        private toasterService: ToasterService) {}

    ngOnInit() {

        // Get the planning of the current week

        this.serviceService.getPlanning().subscribe(days => {
            this.days = days;
            this.updateDayDetails(this.days[0]);
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });

        // Get actual services of the connected user

        this.updateMyServices();
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

    updateMyServices() {
        this.barmanService.getServicesOfCurrentWeekByCat(12,
            this.serviceService.getStartOfCurrentWeek(),
            this.serviceService.getEndOfCurrentWeek())
        .subscribe(categories => {
            this.myServices = categories.map(category => {
                return category.services.map(service => {
                    this.serviceService.getBarmen(service.id).subscribe(barmen => {
                        service.barmen = barmen;
                        return service;
                    }, error => {
                        this.toasterService.showToaster(error, 'Fermer');
                    });
                });
            });
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    addService(service: Service) {
        // TODO /me
        this.barmanService.addService(12, [service.id]).subscribe(() => {
            this.toasterService.showToaster('Service enregistré', 'Fermer');
            this.updateMyServices();
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    removeService(service: Service) {
        this.barmanService.removeService(12, [service.id]).subscribe(() => {
            this.toasterService.showToaster('Service supprimé', 'Fermer');
            this.updateMyServices();
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
