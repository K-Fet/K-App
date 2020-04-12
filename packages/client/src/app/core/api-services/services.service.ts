import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Day, Service, User } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { addWeeks, format } from 'date-fns';
import { createHttpParams, getCurrentWeek } from '../../shared/utils';
import { fr } from 'date-fns/locale';
import { toURL } from './api-utils';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { BaseCrudService } from './base-crud.service';
import { map } from 'rxjs/operators';

export type AdditionalServicesOptions = {
  startAt: Date;
  endAt: Date;
}

export type ServiceWeek = { start: Date; end: Date };

@Injectable()
export class ServicesService extends BaseCrudService<Service, AdditionalServicesOptions> {
  readonly $weekInterval: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  readonly $week: Observable<ServiceWeek> = this.$weekInterval.pipe(map(weekInterval => {
    const current = getCurrentWeek();
    return ({
      start: addWeeks(current.start, weekInterval),
      end: addWeeks(current.end, weekInterval),
    });
  }));

  constructor(http: HttpClient) {
    super(http, toURL('v2/core/v1/services'));

    this.$week.subscribe(() => this.refreshSubject.next());
  }

  async addBarman(userId: string, services: string[]): Promise<Service[]> {
    return this.http.post<Service[]>(`${this.baseUrl}/barmen/${userId}`, { services }).toPromise();
  }

  async removeBarman(userId: string, services: string[]): Promise<Service[]> {
    return this.http.post<Service[]>(`${this.baseUrl}/barmen/${userId}/remove`, { services }).toPromise();
  }

  async getAllActiveBarmen(startAt: Date, endAt: Date): Promise<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/barmen`,
      { params: createHttpParams({ startAt, endAt }) },
    ).toPromise();
  }

  async getFromBarman(userId: string, options: AdditionalServicesOptions & MoleculerListOptions): Promise<MoleculerList<Service>> {
    return this.http.get<MoleculerList<Service>>(
      `${this.baseUrl}/barmen/${userId}`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  async getPlanning(start: Date, end: Date): Promise<Map<string, Day>> {
    const days = new Map<string, Day>();
    const services = await this.find({
      startAt: start,
      endAt: end,
      limit: 10_000,
      populate: 'barmen',
    });

    services.forEach((service) => {
      const name = format(service.startAt, 'EEE', { locale: fr });
      if (!days.has(name)) {
        days.set(name, { name, date: service.startAt, active: false, services: [] });
      }

      days.get(name).services.push(service);
    });

    return days;
  }
}
