import {Component} from '@angular/core';
import { Service } from '../../_models/Service';
import { ServiceService } from '../../_services/service.service';
import { ToasterService } from '../../_services/toaster.service';


@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent {

    services: Service[];

    constructor(private serviceService: ServiceService, private toasterService: ToasterService) {
    }

    ngOnInit() {
        this.services = ServiceService.get
    }
}
