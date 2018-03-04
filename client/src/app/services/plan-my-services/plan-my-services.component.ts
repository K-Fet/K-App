import {Component, OnInit} from '@angular/core';
import { Service, ConnectedUser } from '../../_models/index';
import { Day, ServiceService, ToasterService, BarmanService, LoginService } from '../../_services/index';

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
        });

        // Get the planning of the current week
        this.serviceService.getWeek().subscribe(week => {
            this.serviceService.getPlanning(week.start, week.end).subscribe(days => {
                if (days.length > 0) {
                    this.days = days;
                    this.updateDayDetails(this.days[0]);
                }
            }, error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
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
        if (this.user.barman) {
            this.serviceService.getWeek().subscribe(week => {
                this.barmanService.getServices(this.user.barman.id, week.start, week.end).subscribe(services => {
                    this.myServices = services.map(service => {
                        this.serviceService.getBarmen(service.id).subscribe(barmen => {
                            service.barmen = barmen;
                            return service;
                        }, error => {
                            this.toasterService.showToaster(error, 'Fermer');
                        });
                    });
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
            }, error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        }
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
