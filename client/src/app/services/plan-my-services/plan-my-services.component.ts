import { Component, OnInit } from '@angular/core';
import { ConnectedUser, Day, Service } from '../../_models/index';
import { AuthService, BarmanService, ServiceService, ToasterService } from '../../_services';

@Component({
    selector: 'app-plan-my-services',
    templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

    myServices: Array<Service>;
    dayServices: Array<Service>;
    days: Array<Day> = new Array<Day>();
    user: ConnectedUser;

    constructor(private serviceService: ServiceService,
                private authService: AuthService,
                private barmanService: BarmanService,
                private toasterService: ToasterService) {}

    ngOnInit(): void {
        // Get connected user
        this.authService.$currentUser.subscribe((user: ConnectedUser) => {
            this.user = user;

            // Get actual services of the connected user
            this.updateMyServices();
        });
        this.updatePlanning(0);
    }

    updatePlanning(dayNumber: Number): void {
         // Get the planning of the current week
        this.serviceService.getWeek().subscribe(week => {
            this.serviceService.getPlanning(week.start, week.end).subscribe(days => {
                if (days.length > 0) {
                    this.days = days;
                    this.updateDayDetails(this.days[+dayNumber]);
                } else {
                    this.days = undefined;
                    this.dayServices = undefined;
                }
            });
        });
    }

    updateDayDetails(day: Day): void {
        this.days.map(currentDay => {
            currentDay.active = currentDay === day ? true : false;
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

    updateMyServices(): void {
        if (this.user.barman) {
            this.serviceService.getWeek().subscribe(week => {
                this.barmanService.getServices(this.user.barman.id, week.start, week.end).subscribe(services => {
                    this.myServices = services.length > 0 ? services : undefined;
                });
            });
        }
    }

    addService(service: Service): void {
        if (this.user.barman) {
            this.barmanService.addService(this.user.barman.id, [service.id]).subscribe(() => {
                this.toasterService.showToaster('Service enregistré');
                this.updateMyServices();
                const dayNumber = this.getCurrentDayIndex();
                this.updatePlanning(dayNumber);
            });
        }
    }
    getCurrentDayIndex(): Number {
        return this.days.indexOf(this.days.filter(day => day.active === true)[0]);
    }

    removeService(service: Service): void {
        this.barmanService.removeService(this.user.barman.id, [service.id]).subscribe(() => {
            this.toasterService.showToaster('Service supprimé');
            this.updateMyServices();
            const dayNumber = this.getCurrentDayIndex();
            this.updatePlanning(dayNumber);
        });
    }

    available(service: Service): Boolean {
        if (!service.barmen || service.barmen.map(barman => barman.id).indexOf(this.user.barman.id)) {
            return true;
        }
        return false;
    }
}
