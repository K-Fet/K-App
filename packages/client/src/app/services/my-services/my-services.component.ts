import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/api-services/auth.service';
import { ServiceService } from '../../core/api-services/service.service';
import { isUserBarman, Service, User } from '../../shared/models';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
})
export class MyServicesComponent implements OnInit {

  myServices: Service[];
  user: User;

  constructor(private authService: AuthService,
    private serviceService: ServiceService) {
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
      if (isUserBarman(user)) {
        this.serviceService.getWeek().subscribe(async (week) => {
          const { rows: services } = await this.serviceService.getFromBarman(this.user._id, {
            startAt: week.start,
            endAt: week.end,
            pageSize: 1000,
          });
          this.myServices = services.length > 0 ? services : undefined;
        });
      }
    });
  }
}
