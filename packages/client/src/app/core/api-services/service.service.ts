import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Day, Service } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { addWeeks, format } from 'date-fns';
import { createHttpParams, getCurrentWeek } from '../../shared/utils';
import { fr } from 'date-fns/locale';
import { toURL } from './api-utils';
import { MoleculerGetOptions, MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

const BASE_URL = toURL('v2/core/v1/services');

export interface ServicesOptions extends MoleculerListOptions {
  startAt: Date;
  endAt: Date;
}

@Injectable()
export class ServiceService {
  $weekInterval: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  list(options: ServicesOptions): Promise<MoleculerList<Service>> {
    return this.http.get<MoleculerList<Service>>(
      BASE_URL,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string, options: MoleculerGetOptions = {}): Promise<Service> {
    return this.http.get<Service>(
      `${BASE_URL}/${id}`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  async create(service: Service): Promise<Service> {
    return await this.http.post<Service>(BASE_URL, service).toPromise();
  }

  async update(service: Service): Promise<Service> {
    return await this.http.put<Service>(`${BASE_URL}/${service._id}`, service).toPromise();
  }

  async remove(id: string): Promise<Service> {
    return await this.http.delete<Service>(`${BASE_URL}/${id}`).toPromise();
  }

  async getPlanning(start: Date, end: Date): Promise<Day[]> {
    const days: Day[] = [];

    const services = await this.list({
      startAt: start,
      endAt: end,
      pageSize: 10_000,
      populate: 'barmen',
    });

    services.rows.forEach((service) => {
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
    return days;
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
}
