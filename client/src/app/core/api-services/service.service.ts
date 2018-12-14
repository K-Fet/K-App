import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Barman, Day, Service } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { addWeeks, format } from 'date-fns';
import { getCurrentWeek } from '../../shared/utils';
import { fr } from 'date-fns/locale';

@Injectable()
export class ServiceService {
  $weekInterval: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  get(start: Date, end: Date): Observable<Service[]> {
    return this.http.get<Service[]>('/api/v1/services', {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    });
  }

  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`/api/v1/services/${id}`);
  }

  getBarmen(id: number): Observable<Barman[]> {
    return this.http.get<Barman[]>(`/api/v1/services/${id}/barmen`);
  }

  create(services: Service[]): Observable<Service[]> {
    return this.http.post<Service[]>('/api/v1/services', services);
  }

  update(service: Service): Observable<Service> {
    return this.http.put<Service>(`/api/v1/services/${service.id}`, service);
  }

  delete(id: number): Observable<Service> {
    return this.http.post<Service>(`/api/v1/services/${id}/delete`, null);
  }

  getWeek(): Observable<{ start: Date, end: Date }> {
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

  getPlanning(start: Date, end: Date): Observable<Day[]> {
    const days: Day[] = [];
    return Observable.create((observer) => {
      this.get(start, end).subscribe(
        (services) => {
          services.forEach((service) => {
            const name = format(service.startAt, 'EEE', { locale: fr });
            const day = days.find(currentDay => currentDay.name === name);

            if (day) return day.services.push(service);

            days.push({
              name,
              date: service.startAt,
              active: false,
              services: [service],
            });
          });
          observer.next(days);
        },
      );
    });
  }
}
