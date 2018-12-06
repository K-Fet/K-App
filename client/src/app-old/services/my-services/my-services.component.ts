import { Component, OnInit } from '@angular/core';
import { AuthService, BarmanService, ServiceService } from '../../_services';
import { ConnectedUser, Service } from '../../_models';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

  myServices: Service[];
  user: ConnectedUser;

  constructor(private authService: AuthService,
              private barmanService: BarmanService,
              private serviceService: ServiceService) {
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user: ConnectedUser) => {
      this.user = user;
      if (this.user.isBarman()) {
        this.serviceService.getWeek().subscribe((week) => {
          this.barmanService.getServices(this.user.barman.id, week.start, week.end).subscribe((services) => {
            this.myServices = services.length > 0 ? services : undefined;
          });
        });
      }
    });
  }
}
