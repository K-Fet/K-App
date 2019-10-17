import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../../shared/models';
import { toURL } from './api-utils';

@Injectable()
export class TemplateService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Template[]> {
    return this.http.get<Template[]>(toURL('v1/templates')).toPromise();
  }

  getById(id: number): Promise<Template> {
    return this.http.get<Template>(toURL(`v1/templates/${id}`)).toPromise();
  }

  create(template: Template): Promise<Template> {
    return this.http.post<Template>(toURL('v1/templates'), template).toPromise();
  }

  update(template: Template): Promise<Template> {
    return this.http.put<Template>(toURL(`v1/templates/${template.id}`), template).toPromise();
  }

  delete(id: number): Promise<Template> {
    return this.http.post<Template>(toURL(`v1/templates/${id}/delete`), null).toPromise();
  }
}
