import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Barman, Service } from '../_models';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Moment } from 'moment';

@Injectable()
export class BarmanService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Barman[]>('/api/barmen');
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
        return this.http.post('/api/barmen/' + id + '/services/delete' , services);
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
