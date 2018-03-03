import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Service, Barman } from '../_models/index';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { ToasterService } from './index';

import * as moment from 'moment';
import { Moment } from 'moment';



@Injectable()
export class ServiceService {
    $weekInterval: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

    constructor(private http: HttpClient) { }

    get(start: Moment, end: Moment) {
        return this.http.get<Service[]>('/api/services', {
            params: {
              start: (+start).toString(),
              end: (+end).toString()
            }}).catch(this.handleError);
    }

    getById(id: Number) {
        return this.http.get<Service>('/api/services/' + id).catch(this.handleError);
    }

    getBarmen(id: Number) {
        return this.http.get<Barman[]>('/api/services/' + id + '/barmen').catch(this.handleError);
    }

    create(services: Service[]) {
        return this.http.post('/api/services', services).catch(this.handleError);
    }

    update(service: Service) {
        return this.http.put('/api/services/' + service.id, service).catch(this.handleError);
    }

    delete(id: Number) {
        return this.http.delete('/api/services/' + id).catch(this.handleError);
    }

    // dayNumber: 7 = sunday, 1 = monday, 2 = thuesday ...
    // Examples:
    // - getLast(0, 0) will return yesterday, if today is monday
    // - getLast(0, 1) will return the sunday a week before yesterday, if today is monday
    // - getLast(1, 0) will return the ultimate monday, if today is monday
    //
    // - getNext(2, 0) will return the next thuesday, if today is monday (tomorrow)
    // - getNext(2, 1) will return the thuesday a week after tomorrow, if today is monday
    // - getNext(1, 0) will return today, if today is monday (/!\ not today)

    getWeek(): Observable<{start: Moment, end: Moment}> {
        return new Observable(week => {
            this.$weekInterval.subscribe(weekInterval => {
                const start: Moment = moment().set({
                    'hour': 0,
                    'minute': 0,
                    'second': 0,
                    'millisecond': 0
                });
                const end: Moment = moment().set({
                    'hour': 23,
                    'minute': 59,
                    'second': 59,
                    'millisecond': 59
                });
                if (moment().weekday() <= DEFAULT_WEEK_SWITCH) {
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
                week.next({ start: start, end: end});
            });
        });
    }

    getPlanning(start: Moment, end: Moment): Observable<Array<Day>> {
        const days: Array<Day> = new Array<Day>();
        return Observable.create((observer) => {
            this.get(start, end).subscribe(services => {
                services.forEach(service => {
                    const day = {
                        name: WEEK_DAY_SHORT[moment(service.startAt).isoWeekday() - 1],
                        date: moment(service.startAt),
                        active: false
                    };
                    if (days.map(currentDay => currentDay.name).indexOf(day.name) === -1) {
                        days.push(day);
                    }
                });
                observer.next(days);
            }, error => {
                observer.error(error);
            });
        });
    }

    getDayServiceDetails(day: Day): Observable<Array<Service>> {
        const services = new Array<Service>();

        const start = day.date.set({
            'hour': 0,
            'minute': 0,
            'second': 0,
            'millisecond': 0
        });
        const end = day.date.set({
            'hour': 23,
            'minute': 59,
            'second': 59,
            'millisecond': 99
        });

        return Observable.create((observer) => {
            this.get(start, end).subscribe(servicesFetched => {
                servicesFetched.map(service => {
                    // For each service of the day, we fetch associated barmen
                    this.getBarmen(service.id).subscribe(barmen => {
                        service.barmen = barmen;
                        return service;
                    }, error => {
                        observer.error(error);
                    });
                    return service;
                });
                observer.next(services);
            }, error => {
                observer.error(error);
            });
        });
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible d'ajouter ou de récuperer un service`;
                    break;
                case 'ServerError':
                    errorMessage = `Erreur serveur`;
                    break;
                default:
                    errorMessage = 'Code d\'erreur inconnu';
                    break;
            }
        }
        return Observable.throw(errorMessage);
    }
}

export interface Day {
    name: String;
    date: Moment;
    active: Boolean;
}

export const DEFAULT_WEEK_SWITCH: Number = 4;

const WEEK_DAY_LONG: Array<String> = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const WEEK_DAY_SHORT: Array<String> = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
