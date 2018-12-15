import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Kommission } from '../../shared/models';

@Injectable()
export class KommissionService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Kommission[]> {
    return this.http.get<Kommission[]>('/api/v1/kommissions').toPromise();
  }

  getById(id: number): Promise<Kommission> {
    return this.http.get<Kommission>(`/api/v1/kommissions/${id}`).toPromise();
  }

  create(kommission: Kommission): Promise<Kommission> {
    return this.http.post<Kommission>('/api/v1/kommissions', kommission).toPromise();
  }

  update(kommission: Kommission): Promise<Kommission> {
    return this.http.put<Kommission>(`/api/v1/kommissions/${kommission.id}`, kommission).toPromise();
  }

  delete(id: number): Promise<Kommission> {
    return this.http.post<Kommission>(`/api/v1/kommissions/${id}/delete`, null).toPromise();
  }
}
