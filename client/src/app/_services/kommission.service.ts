import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Kommission } from '../_models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class KommissionService {

  dataChange: BehaviorSubject<Kommission[]> = new BehaviorSubject<Kommission[]>([]);

  get data(): Kommission[] { return this.dataChange.value; }

  constructor(private http: HttpClient) { }

  getAll(): Observable<Kommission[]> {
    return this.http.get<Kommission[]>('/api/kommissions');
  }

  getById(id: number): Observable<Kommission> {
    return this.http.get<Kommission>(`/api/kommissions/${id}`);
  }

  create(kommission: Kommission): Observable<Kommission> {
    return this.http.post<Kommission>('/api/kommissions', kommission);
  }

  update(kommission: Kommission): Observable<Kommission> {
    return this.http.put<Kommission>(`/api/kommissions/${kommission.id}`, kommission);
  }

  delete(id: number): Observable<Kommission> {
    return this.http.post<Kommission>(`/api/kommissions/${id}/delete`, null);
  }
}
