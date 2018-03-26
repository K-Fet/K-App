import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Barman, Service } from '../_models/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BarmanService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Barman>> {
        return this.http.get<Array<Barman>>('/api/barmen');
    }

    getById(id: number): Observable<Barman> {
        return this.http.get<Barman>(`/api/barmen/${id}`);
    }

    getServices(id: Number, start: Moment, end: Moment): Observable<Array<Service>> {
        return this.http.get<Array<Service>>(`/api/barmen/${id}/services`, {
            params: {
                start: (+start).toString(),
                end: (+end).toString()
            }});
    }

    create(barman: Barman): Observable<any> {
        return this.http.post('/api/barmen', barman);
    }

    addService(id: Number, services: Array<Number>): Observable<Service> {
        return this.http.post<Service>(`/api/barmen/${id}/services`, services);
    }

    removeService(id: Number, services: Array<Number>): Observable<Service> {
        const options = {
            body: services
        };

        return this.http.request<Service>('DELETE', `/api/barmen/${id}/services` , options);
    }

    update(barman: Barman): Observable<Barman> {
        const id = barman.id;
        delete barman.id;

        return this.http.put<Barman>(`/api/barmen/${id}`, barman);
    }

    delete(id: Number): Observable<Barman> {
        return this.http.delete<Barman>(`/api/barmen/${id}`);
    }
}
