import { Component, OnInit } from '@angular/core';
import { BarmanService } from '../../core/api-services/barman.service';
import { AuthService } from '../../core/api-services/auth.service';
import { ServiceService } from '../../core/api-services/service.service';
import { ConnectedUser, Day, Service } from '../../shared/models';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-plan-my-services',
  templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

  myServices: Service[];
  dayServices: Service[];
  days: Day[] = [];
  user: ConnectedUser;

  constructor(private serviceService: ServiceService,
              private authService: AuthService,
              private barmanService: BarmanService,
              private toasterService: ToasterService) {}

  ngOnInit(): void {
    // Get connected user
    this.authService.$currentUser.subscribe((user: ConnectedUser) => {
      this.user = user;

      // Get actual services of the connected user
      this.updateMyServices();
    });
    this.updatePlanning(0);
  }

  updatePlanning(dayNumber: number): void {
    // Get the planning of the current week
    this.serviceService.getWeek().subscribe((week) => {
      this.serviceService.getPlanning(week.start, week.end).subscribe((days) => {
        if (days.length > 0) {
          this.days = days;
          this.updateDayDetails(this.days[+dayNumber]);
        } else {
          this.days = undefined;
          this.dayServices = undefined;
        }
      });
    });
  }

  updateDayDetails(day: Day): void {
    this.days.map((currentDay) => {
      currentDay.active = currentDay === day;
      return currentDay;
    });
    this.dayServices = this.days.filter((currentDay) => {
      return currentDay.active;
    }).map((currentDay) => {
      currentDay.services.map((service) => {
        if (service.barmen && service.barmen.length === 0) {
          service.barmen = undefined;
        }
        return service;
      });
      return currentDay.services;
    })[0];
  }

  updateMyServices(): void {
    if (this.user.barman) {
      this.serviceService.getWeek().subscribe(async (week) => {
        const services = await this.barmanService.getServices(this.user.barman.id, week.start, week.end);
        this.myServices = services.length > 0 ? services : undefined;
      });
    }
  }

  async addService(service: Service) {
    if (this.user.barman) {
      await this.barmanService.addService(this.user.barman.id, [service.id]);
      this.toasterService.showToaster('Service enregistré');
      this.updateMyServices();
      const dayNumber = this.getCurrentDayIndex();
      this.updatePlanning(dayNumber);
    }
  }

  getCurrentDayIndex(): number {
    return this.days.indexOf(this.days.filter(day => day.active)[0]);
  }

  async removeService(service: Service) {
    await this.barmanService.removeService(this.user.barman.id, [service.id]);
    this.toasterService.showToaster('Service supprimé');
    this.updateMyServices();
    const dayNumber = this.getCurrentDayIndex();
    this.updatePlanning(dayNumber);
  }

  available(service: Service): boolean {
    return !service.barmen || service.barmen.filter(barman => barman.id === this.user.barman.id).length === 0;
  }

  isPasted(service): boolean {
    return new Service(service).isPasted();
  }

  getColor(service: Service): Object {
    return (service.barmen && service.barmen.length >= service.nbMax) ? 'red' : 'green';
  }
}
