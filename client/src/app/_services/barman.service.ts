import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barman, Service } from '../_models';
import { Moment } from 'moment';
import { Observable } from 'rxjs';

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
                end: (+end).toString(),
            }});
    }

    create(barman: Barman): Observable<Barman> {
        return this.http.post<Barman>('/api/barmen', barman);
    }

    addService(id: Number, services: Array<Number>): Observable<Service> {
        return this.http.post<Service>(`/api/barmen/${id}/services`, services);
    }

    removeService(id: Number, services: Array<Number>): Observable<Service> {
        return this.http.post<Service>(`/api/barmen/${id}/services/delete`, services);
    }

    update(barman: Barman): Observable<Barman> {
        return this.http.put<Barman>(`/api/barmen/${barman.id}`, barman);
    }

    delete(id: Number): Observable<Barman> {
        return this.http.post<Barman>(`/api/barmen/${id}/delete`, null);
    }
}
