import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Barman, Day, Service } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { addWeeks, format } from 'date-fns';
import { getCurrentWeek } from '../../shared/utils';
import { fr } from 'date-fns/locale';
import { toURL } from './api-utils';

@Injectable()
export class ServiceService {
  $weekInterval: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  get(start: Date, end: Date): Promise<Service[]> {
    return this.http.get<Service[]>(toURL('v1/services'), {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    }).toPromise();
  }

  getById(id: number): Promise<Service> {
    return this.http.get<Service>(toURL(`v1/services/${id}`)).toPromise();
  }

  getBarmen(id: number): Promise<Barman[]> {
    return this.http.get<Barman[]>(toURL(`v1/services/${id}/barmen`)).toPromise();
  }

  create(services: Service[]): Promise<Service[]> {
    return this.http.post<Service[]>(toURL('v1/services'), services).toPromise();
  }

  update(service: Service): Promise<Service> {
    return this.http.put<Service>(toURL(`v1/services/${service.id}`), service).toPromise();
  }

  delete(id: number): Promise<Service> {
    return this.http.post<Service>(toURL(`v1/services/${id}/delete`), null).toPromise();
  }

  getWeek(): Observable<{ start: Date; end: Date }> {
    return new Observable((week) => {
      this.$weekInterval.subscribe((weekInterval) => {
        const current = getCurrentWeek();
        week.next({
          start: addWeeks(current.start, weekInterval),
          end: addWeeks(current.end, weekInterval),
        });
      });
    });
  }

  async getPlanning(start: Date, end: Date): Promise<Day[]> {
    const days: Day[] = [];

    const services = await this.get(start, end);

    services.forEach((service) => {
      const name = format(new Date(service.startAt), 'EEE', { locale: fr });
      const day = days.find(currentDay => currentDay.name === name);

      if (day) return day.services.push(service);

      days.push({
        name,
        date: service.startAt,
        active: false,
        services: [service],
      });
    });
    return days;
  }
}
