import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Barman, Day, Service } from '../_models';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

// The K-Fêt week change every thusday ( = 4 )
export const DEFAULT_WEEK_SWITCH: Number = 4;
const WEEK_DAY_SHORT: Array<String> = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

@Injectable()
export class ServiceService {
    $weekInterval: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

    constructor(private http: HttpClient) { }

    get(start: Moment, end: Moment): Observable<Array<Service>> {
        return this.http.get<Array<Service>>('/api/services', {
            params: {
                start: (+start).toString(),
                end: (+end).toString(),
            }});
    }

    getById(id: Number): Observable<Service> {
        return this.http.get<Service>(`/api/services/${id}`);
    }

    getBarmen(id: Number): Observable<Array<Barman>> {
        return this.http.get<Array<Barman>>(`/api/services/${id}/barmen`);
    }

    create(services: Array<Service>): Observable<Array<Service>> {
        return this.http.post<Array<Service>>('/api/services', services);
    }

    update(service: Service): Observable<Service> {
        return this.http.put<Service>(`/api/services/${service.id}`, service);
    }

    delete(id: Number): Observable<Service> {
        return this.http.post<Service>(`/api/services/${id}/delete`, null);
    }

    getWeek(): Observable<{start: Moment, end: Moment}> {
        return new Observable(week => {
            this.$weekInterval.subscribe(weekInterval => {
                const start: Moment = moment.utc().set({
                    'hour': 0,
                    'minute': 0,
                    'second': 0,
                    'millisecond': 0,
                });
                const end: Moment = moment.utc().set({
                    'hour': 23,
                    'minute': 59,
                    'second': 59,
                    'millisecond': 59,
                });
                if (moment().isoWeekday() <= DEFAULT_WEEK_SWITCH) {
                    start.isoWeekday(+DEFAULT_WEEK_SWITCH + 1).subtract(1, 'week');
                    end.isoWeekday(+DEFAULT_WEEK_SWITCH);
                } else {
                    start.isoWeekday(+DEFAULT_WEEK_SWITCH + 1);
                    end.isoWeekday(+DEFAULT_WEEK_SWITCH).add(1, 'week');
                }
                if (weekInterval < 0) {
                    start.subtract(Math.abs(+weekInterval), 'week');
                    end.subtract(Math.abs(+weekInterval), 'week');
                } else if (weekInterval > 0) {
                    start.add(Math.abs(+weekInterval), 'week');
                    end.add(Math.abs(+weekInterval), 'week');
                }
                week.next({ start: start, end: end });
            });
        });
    }

    getPlanning(start: Moment, end: Moment): Observable<Array<Day>> {
        const days: Array<Day> = new Array<Day>();
        return Observable.create((observer) => {
            this.get(start, end).subscribe(services => {
                services.forEach(service => {
                    const name = WEEK_DAY_SHORT[moment(service.startAt).isoWeekday()];
                    const index = days.map(currentDay => currentDay.name).indexOf(name);
                    if (index === -1) {
                        const day = {
                            name: WEEK_DAY_SHORT[moment(service.startAt).isoWeekday()],
                            date: moment.utc(service.startAt),
                            active: false,
                            services: [],
                        };
                        day.services.push(service);
                        days.push(day);
                    } else {
                        days[index].services.push(service);
                    }
                });
                observer.next(days);
            }, error => {
                observer.error(error);
            });
        });
    }
}
