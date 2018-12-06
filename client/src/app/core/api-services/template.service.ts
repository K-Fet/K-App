import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class TemplateService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Template[]> {
    return this.http.get<Template[]>('/api/v1/templates');
  }

  getById(id: number): Observable<Template> {
    return this.http.get<Template>(`/api/v1/templates/${id}`);
  }

  create(template: Template): Observable<Template> {
    return this.http.post<Template>('/api/v1/templates', template);
  }

  update(template: Template): Observable<Template> {
    return this.http.put<Template>(`/api/v1/templates/${template.id}`, template);
  }

  delete(id: number): Observable<Template> {
    return this.http.post<Template>(`api/v1/templates/${id}/delete`, null);
  }
}
