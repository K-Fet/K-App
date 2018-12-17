import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../../shared/models';

@Injectable()
export class TemplateService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Template[]> {
    return this.http.get<Template[]>('/api/v1/templates').toPromise();
  }

  getById(id: number): Promise<Template> {
    return this.http.get<Template>(`/api/v1/templates/${id}`).toPromise();
  }

  create(template: Template): Promise<Template> {
    return this.http.post<Template>('/api/v1/templates', template).toPromise();
  }

  update(template: Template): Promise<Template> {
    return this.http.put<Template>(`/api/v1/templates/${template.id}`, template).toPromise();
  }

  delete(id: number): Promise<Template> {
    return this.http.post<Template>(`api/v1/templates/${id}/delete`, null).toPromise();
  }
}
