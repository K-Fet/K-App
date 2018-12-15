import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barman, Service, Task } from '../../shared/models';

@Injectable()
export class BarmanService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Barman[]> {
    return this.http.get<Barman[]>('/api/v1/barmen').toPromise();
  }

  getById(id: number): Promise<Barman> {
    return this.http.get<Barman>(`/api/v1/barmen/${id}`).toPromise();
  }

  getServices(id: number, start: Date, end: Date): Promise<Service[]> {
    return this.http.get<Service[]>(`/api/v1/barmen/${id}/services`, {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    }).toPromise();
  }

  getTasks(): Promise<Task[]> {
    return this.http.get<Task[]>('/api/v1/me/tasks').toPromise();
  }

  create(barman: Barman): Promise<Barman> {
    return this.http.post<Barman>('/api/v1/barmen', barman).toPromise();
  }

  getAllActiveBarmenWithServices(start: Date, end: Date): Promise<Barman[]> {
    return this.http.get<Barman[]>('/api/v1/barmen/services', {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    }).toPromise();
  }

  addService(id: number, services: number[]): Promise<Service> {
    return this.http.post<Service>(`/api/v1/barmen/${id}/services`, services).toPromise();
  }

  removeService(id: number, services: number[]): Promise<Service> {
    return this.http.post<Service>(`/api/v1/barmen/${id}/services/delete`, services).toPromise();
  }

  update(barman: Barman): Promise<Barman> {
    return this.http.put<Barman>(`/api/v1/barmen/${barman.id}`, barman).toPromise();
  }

  delete(id: number): Promise<Barman> {
    return this.http.post<Barman>(`/api/v1/barmen/${id}/delete`, null).toPromise();
  }
}
