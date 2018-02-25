import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Barman, Service } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Categories } from './index';

import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable()
export class BarmanService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Barman[]>('/api/barmen').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Barman>('/api/barmen/' + id).catch(this.handleError);
    }

    getServicesOfCurrentWeek(id: Number, start: Moment, end: Moment) {
        return this.http.get<Service[]>('/api/barmen/' + id + '/services', {
            params: {
                start: (+start).toString(),
                end: (+end).toString()
            }}).catch(this.handleError);
    }

    getServicesOfCurrentWeekByCat(id: Number, start: Moment, end: Moment) {
        return Observable.create(observer => {
            const categories = new Array<Categories>();

            this.getServicesOfCurrentWeek(id, start, end).subscribe(services => {
                services.forEach(service => {
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

    create(barman: Barman) {
        return this.http.post('/api/barmen', barman).catch(this.handleError);
    }

    addService(id: Number, services: Number[]) {
        return this.http.post('/api/barmen' + id + '/services', services).catch(this.handleError);
    }

    removeService(id: Number, services: Number[]) {
        // TODO Fix DELETE body issue
        return this.http.delete('/api/barmen' + id + '/services' /*, [service] */).catch(this.handleError);
    }

    update(barman: Barman) {
        return this.http.put('/api/barmen/' + barman.id, barman).catch(this.handleError);
    }

    delete(id: Number) {
        return this.http.delete('/api/barmen/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknowBarman':
                    errorMessage = `Erreur, impossible de recuperer le barman`;
                    break;
                case 'UnauthorizedError':
                    errorMessage = `Erreur: opération non autorisée`;
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
