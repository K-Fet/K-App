import {Component, OnInit} from '@angular/core';
import { Service, ConnectedUser, Day } from '../../_models/index';
import { ServiceService, ToasterService, BarmanService, LoginService } from '../../_services/index';

@Component({
    selector: 'app-plan-my-services',
    templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

    myServices: Service[];
    dayServices: Service[];
    days: Day[] = new Array<Day>();
    user: ConnectedUser;

    constructor(private serviceService: ServiceService,
        private loginService: LoginService,
        private barmanService: BarmanService,
        private toasterService: ToasterService) {}

    ngOnInit() {
        // Get connected user
        this.loginService.me().subscribe(user => {
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
            }, error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
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
        this.dayServices = this.days.filter(currentDay => {
            return currentDay.active === true;
        }).map(currentDay => {
            currentDay.services.map(service => {
                if  (service.barmen && service.barmen.length === 0) {
                    service.barmen = undefined;
                }
                return service;
            });
            return currentDay.services;
        })[0];
    }

    updateMyServices() {
        if (this.user.barman) {
            this.serviceService.getWeek().subscribe(week => {
                this.barmanService.getServices(this.user.barman.id, week.start, week.end).subscribe(services => {
                    if (services.length > 0) {
                        this.myServices = services;
                    } else {
                        this.myServices = undefined;
                    }
                }, error => {
                    this.toasterService.showToaster(error, 'Fermer');
                });
            });
        }
    }

    addService(service: Service) {
        if (this.user.barman) {
            this.barmanService.addService(this.user.barman.id, [service.id]).subscribe(() => {
                this.toasterService.showToaster('Service enregistré', 'Fermer');
                this.updateMyServices();
                const dayNumber = this.getCurrentDayIndex();
                this.updatePlanning(dayNumber);
            }, error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        }
    }
    getCurrentDayIndex(): Number {
        return this.days.indexOf(this.days.filter(day => day.active === true)[0]);
    }

    removeService(service: Service) {
        this.barmanService.removeService(this.user.barman.id, [service.id]).subscribe(() => {
            this.toasterService.showToaster('Service supprimé', 'Fermer');
            this.updateMyServices();
            const dayNumber = this.getCurrentDayIndex();
            this.updatePlanning(dayNumber);
        }, error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
