import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/Service';
import { BarmanService, ToasterService, LoginService, ServiceService } from '../../_services/';
import { Moment } from 'moment';
import { ConnectedUser } from '../../_models/index';

@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

    myServices: Service[];
    user: ConnectedUser;

    constructor(private loginService: LoginService,
        private barmanService: BarmanService,
        private serviceService: ServiceService,
        private toasterService: ToasterService) {
    }

    ngOnInit() {
        this.loginService.me().subscribe(user => {
            this.user = user;
        });
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
}
