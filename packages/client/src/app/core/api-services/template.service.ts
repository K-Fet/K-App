import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { Template } from '../../shared/models';
import { toURL } from './api-utils';
import { createHttpParams } from '../../shared/utils';

const BASE_URL = toURL('v2/core/v1/services-templates');

@Injectable()
export class TemplateService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions): Promise<MoleculerList<Template>> {
    return this.http.get<MoleculerList<Template>>(
      BASE_URL,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string): Promise<Template> {
    return this.http.get<Template>(`${BASE_URL}/${id}`).toPromise();
  }

  async create(template: Template): Promise<Template> {
    return await this.http.post<Template>(BASE_URL, template).toPromise();
  }

  async update(template: Template): Promise<Template> {
    return await this.http.put<Template>(`${BASE_URL}/${template._id}`, template).toPromise();
  }

  async remove(id: string): Promise<Template> {
    return await this.http.delete<Template>(`${BASE_URL}/${id}`).toPromise();
  }
}
