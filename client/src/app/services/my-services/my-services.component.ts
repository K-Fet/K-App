import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/Service';
import { BarmanService, ToasterService, LoginService, ServiceService } from '../../_services/';
import { Moment } from 'moment';

@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

    myServices: Service[];

    constructor(private loginService: LoginService,
        private barmanService: BarmanService,
        private serviceService: ServiceService,
        private toasterService: ToasterService) {
    }

    ngOnInit() {
        // TODO /me to get the id of the connected barman
        this.serviceService.getWeek().subscribe(week => {
            this.barmanService.getServices(12, week.start, week.end).subscribe(services => {
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
