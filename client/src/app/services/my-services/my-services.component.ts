import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/Service';
import { BarmanService, ToasterService, LoginService, ServiceService, DEFAULT_WEEK } from '../../_services/';

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
        this.barmanService.getServicesOfCurrentWeek(12,
            this.serviceService.getStartEnd().start,
            this.serviceService.getStartEnd().end)
        .subscribe(services => {
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
    }
}
