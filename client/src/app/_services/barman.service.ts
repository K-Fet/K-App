import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Barman, Service } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as moment from 'moment';
import { Moment, weekdays } from 'moment';

@Injectable()
export class BarmanService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Barman[]>('/api/barmens');
    }

    getById(id: number) {
        return this.http.get<Barman>('/api/barmen/' + id);
    }

    getServices(id: Number, start: Moment, end: Moment) {
        return this.http.get<Service[]>('/api/barmen/' + id + '/services', {
            params: {
                start: (+start).toString(),
                end: (+end).toString()
            }});
    }

    create(barman: Barman) {
        return this.http.post('/api/barmen', barman);
    }

    addService(id: Number, services: Number[]) {
        return this.http.post('/api/barmen/' + id + '/services', services);
    }

    removeService(id: Number, services: Number[]) {
        const options = {
            body: services
        };
        return this.http.request('DELETE', '/api/barmen/' + id + '/services' , options);
    }

    update(barman: Barman) {
        const id = barman.id;
        delete barman.id;
        return this.http.put('/api/barmen/' + id, barman);
    }

    delete(id: Number) {
        return this.http.delete('/api/barmen/' + id);
    }
}
