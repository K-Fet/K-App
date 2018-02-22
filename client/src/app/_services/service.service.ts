import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Service, Barman } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { ToasterService } from './index';

@Injectable()
export class ServiceService {

    constructor(private http: HttpClient) { }

    get(start: Number, end: Number) {
        return this.http.get<Service[]>('/api/services', {
            params: {
              start: start.toString(),
              end: end.toString()
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

    getStartOfCurrentWeek(): Number {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.setDate(currentDate.getDate() - (7 - 5 + currentDate.getDay()) % 7 );
    }

    getEndOfCurrentWeek(): Number {
        const currentDate = new Date();
        currentDate.setHours(23, 59, 59, 99);
        return currentDate.setDate(currentDate.getDate() + (7 + 4 - currentDate.getDay()) % 7 );
    }

    getPlanning(): Observable<Array<Day>> {
        const days: Array<Day> = new Array<Day>();

        return Observable.create((observer) => {
            this.get(this.getStartOfCurrentWeek(), this.getEndOfCurrentWeek()).subscribe(services => {
                services.forEach(service => {
                    const startAt = new Date(service.startAt);
                    const day = {
                        name: WEEK_DAY_SHORT[startAt.getDay().toString()],
                        date: startAt,
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

    getDayServiceDetails(day: Day): Observable<Array<Categories>> {
        const categories = new Array<Categories>();

        const start = new Date(day.date.setHours(0, 0, 0, 0)).getTime();
        const end = new Date(day.date.setHours(23, 59, 0, 0)).getTime();

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
                }).forEach(service => {
                    // Sort by category
                    if (service.category) {
                        const index = categories.map(category => category.name).indexOf(service.category.name);
                        if (index === -1) {
                            categories.push(
                                {
                                    name: service.category.name,
                                    services: [service]
                                }
                            );
                        } else {
                            categories[index].services.push(service);
                        }
                    } else {
                        const index = categories.map(category => category.name).indexOf('Sans categorie');
                        if (index === -1) {
                            categories.push({
                                name: 'Sans categorie',
                                services: [service]
                            });
                        } else {
                            categories[index].services.push(service);
                        }
                    }
                });
                observer.next(categories);
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
    date: Date;
    active: Boolean;
}

export interface Categories {
    name?: String;
    services?: Service[];
}

const WEEK_DAY_LONG: Array<String> = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const WEEK_DAY_SHORT: Array<String> = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
