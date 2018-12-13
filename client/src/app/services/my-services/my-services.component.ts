import { Component, OnInit } from '@angular/core';
import { BarmanService } from '../../core/api-services/barman.service';
import { AuthService } from '../../core/api-services/auth.service';
import { ServiceService } from '../../core/api-services/service.service';
import { ConnectedUser, Service } from '../../shared/models';

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
