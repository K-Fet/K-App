import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barman, Service, Task } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class BarmanService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Barman[]> {
    return this.http.get<Barman[]>('/api/v1/barmen');
  }

  getById(id: number): Observable<Barman> {
    return this.http.get<Barman>(`/api/v1/barmen/${id}`);
  }

  getServices(id: number, start: Date, end: Date): Observable<Service[]> {
    return this.http.get<Service[]>(`/api/v1/barmen/${id}/services`, {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/v1/me/tasks');
  }

  create(barman: Barman): Observable<Barman> {
    return this.http.post<Barman>('/api/v1/barmen', barman);
  }

  getAllActiveBarmenWithServices(start: Date, end: Date): Observable<Barman[]> {
    return this.http.get<Barman[]>('/api/v1/barmen/services', {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    });
  }

  addService(id: number, services: number[]): Observable<Service> {
    return this.http.post<Service>(`/api/v1/barmen/${id}/services`, services);
  }

  removeService(id: number, services: number[]): Observable<Service> {
    return this.http.post<Service>(`/api/v1/barmen/${id}/services/delete`, services);
  }

  update(barman: Barman): Observable<Barman> {
    return this.http.put<Barman>(`/api/v1/barmen/${barman.id}`, barman);
  }

  delete(id: number): Observable<Barman> {
    return this.http.post<Barman>(`/api/v1/barmen/${id}/delete`, null);
  }
}
