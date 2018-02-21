import {Component, OnInit} from '@angular/core';
import { Service } from '../../_models/Service';
import { BarmanService, ToasterService, LoginService } from '../../_services/';
import { Category } from '../../_models/index';

@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

    categories: Categories[];

    constructor(private loginService: LoginService, private barmanService: BarmanService, private toasterService: ToasterService) {
    }

    ngOnInit() {
        const start = new Date();
        const end = new Date();

        start.setDate(start.getDate() - (7 - 5 + start.getDay()) % 7 );
        end.setDate(end.getDate() + (7 + 4 - end.getDay()) % 7 );

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 0, 0);

        this.barmanService.getServices(12 /* TODO /me to get the id of the connected barman */, start, end).subscribe(services => {
            this.categories = new Array<Categories>();
            services.map(service => {
                const index = this.categories.map(category => category.name).indexOf(service.category.name);
                if (index === -1) {
                    this.categories.push(
                        {
                            name: service.category.name,
                            services: [service]
                        }
                    );
                } else {
                    this.categories[index].services.push(service);
                }
            });
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}

interface Categories {
    name?: String;
    services?: Service[];
}
