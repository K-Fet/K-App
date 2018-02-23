import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/Service';
import { BarmanService, ToasterService, LoginService, ServiceService, Categories } from '../../_services/';
import { Category } from '../../_models/index';

@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

    myServices: Categories[];

    constructor(private loginService: LoginService,
        private barmanService: BarmanService,
        private serviceService: ServiceService,
        private toasterService: ToasterService) {
    }

    ngOnInit() {
        // TODO /me to get the id of the connected barman
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
}
