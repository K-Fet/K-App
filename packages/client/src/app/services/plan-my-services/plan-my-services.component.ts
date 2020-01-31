import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/api-services/auth.service';
import { ServiceService } from '../../core/api-services/service.service';
import { Day, isServicePassed, isUserBarman, Service, User } from '../../shared/models';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-plan-my-services',
  templateUrl: './plan-my-services.component.html',
})

export class PlanMyServicesComponent implements OnInit {

  myServices: Service[];
  dayServices: Service[];
  days: Day[] = [];
  user: User;

  constructor(private serviceService: ServiceService,
    private authService: AuthService,
    private toasterService: ToasterService) {}

  ngOnInit(): void {
    // Get connected user
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;

      // Get actual services of the connected user
      this.updateMyServices();
    });
    this.updatePlanning(0);
  }

  updatePlanning(dayNumber: number): void {
    // Get the planning of the current week
    this.serviceService.getWeek().subscribe(async (week) => {
      const days = await this.serviceService.getPlanning(week.start, week.end);
      if (days.length > 0) {
        this.days = days;
        this.updateDayDetails(this.days[+dayNumber]);
      } else {
        this.days = undefined;
        this.dayServices = undefined;
      }
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
    if (isUserBarman(this.user)) {
      this.serviceService.getWeek().subscribe(async (week) => {
        const { rows: services } = await this.serviceService.getFromBarman(this.user._id, {
          startAt: week.start,
          endAt: week.end,
          pageSize: 1000,
        });

        this.myServices = services.length > 0 ? services : undefined;
      });
    }
  }

  async addService(service: Service) {
    if (isUserBarman(this.user)) {
      await this.serviceService.addBarman(this.user._id, [service._id]);
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
    await this.serviceService.removeBarman(this.user._id, [service._id]);
    this.toasterService.showToaster('Service supprimé');
    this.updateMyServices();
    const dayNumber = this.getCurrentDayIndex();
    this.updatePlanning(dayNumber);
  }

  available(service: Service): boolean {
    return !service.barmen || (service.barmen as User[]).filter(barman => barman._id === this.user._id).length === 0;
  }

  isPassed(service): boolean {
    return isServicePassed(service);
  }

  getColor(service: Service): string {
    return (service.barmen && service.barmen.length >= service.nbMax) ? 'red' : 'green';
  }

  isFull(service: Service): boolean {
    return service.barmen && service.barmen.length >= service.nbMax;
  }
}
