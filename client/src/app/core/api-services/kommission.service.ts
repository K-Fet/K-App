import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Kommission } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class KommissionService {

  dataChange: BehaviorSubject<Kommission[]> = new BehaviorSubject<Kommission[]>([]);

  get data(): Kommission[] { return this.dataChange.value; }

  constructor(private http: HttpClient) { }

  getAll(): Observable<Kommission[]> {
    return this.http.get<Kommission[]>('/api/v1/kommissions');
  }

  getById(id: number): Observable<Kommission> {
    return this.http.get<Kommission>(`/api/v1/kommissions/${id}`);
  }

  create(kommission: Kommission): Observable<Kommission> {
    return this.http.post<Kommission>('/api/v1/kommissions', kommission);
  }

  update(kommission: Kommission): Observable<Kommission> {
    return this.http.put<Kommission>(`/api/v1/kommissions/${kommission.id}`, kommission);
  }

  delete(id: number): Observable<Kommission> {
    return this.http.post<Kommission>(`/api/v1/kommissions/${id}/delete`, null);
  }
}
