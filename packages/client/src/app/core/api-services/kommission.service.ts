import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { Kommission } from '../../shared/models';
import { toURL } from './api-utils';
import { createHttpParams } from '../../shared/utils';

const BASE_URL = toURL('v2/core/v1/kommissions');

@Injectable()
export class KommissionService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions): Promise<MoleculerList<Kommission>> {
    return this.http.get<MoleculerList<Kommission>>(
      BASE_URL,
      {
        params: createHttpParams({
          ...options,
          page: options.page && options.page.toString(),
          pageSize: options.pageSize && options.pageSize.toString(),
        }),
      },
    ).toPromise();
  }

  get(id: string): Promise<Kommission> {
    return this.http.get<Kommission>(`${BASE_URL}/${id}`).toPromise();
  }

  async create(kommission: Kommission): Promise<Kommission> {
    return await this.http.post<Kommission>(BASE_URL, kommission).toPromise();
  }

  async update(kommission: Kommission): Promise<Kommission> {
    return await this.http.put<Kommission>(`${BASE_URL}/${kommission._id}`, kommission).toPromise();
  }

  async remove(id: string): Promise<Kommission> {
    return await this.http.delete<Kommission>(`${BASE_URL}/${id}`).toPromise();
  }
}
