import { Component, OnInit } from '@angular/core';
import { BarmanService, LoginService, ServiceService } from '../../_services/';
import { ConnectedUser, Service } from '../../_models/index';

@Component({
    selector: 'ngx-my-services',
    templateUrl: './my-services.component.html'
})

export class MyServicesComponent implements OnInit {

    myServices: Array<Service>;
    user: ConnectedUser;

    constructor(private loginService: LoginService,
                private barmanService: BarmanService,
                private serviceService: ServiceService) {
    }

    ngOnInit(): void {
        this.loginService.$currentUser.subscribe((user: ConnectedUser) => {
            this.user = user;
            if (this.user.barman)
                this.serviceService.getWeek()
                .subscribe(week => {
                    this.barmanService.getServices(this.user.barman.id, week.start, week.end)
                    .subscribe(services => {
                        this.myServices = services.length > 0 ? services : undefined;
                    });
                });
        });
    }
}
