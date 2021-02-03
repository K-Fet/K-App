import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provider } from '../providers/provider.model';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { createHttpParams } from '../../shared/utils';
import { toURL } from '../../core/api-services/api-utils';

const BASE_URL = toURL('v2/inventory-management/providers');

@Injectable()
export class ProvidersService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions = {}): Promise<MoleculerList<Provider>> {
    return this.http.get<MoleculerList<Provider>>(
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

  async listAll(): Promise<Provider[]> {
    return (await this.list({pageSize: 100})).rows; 
  }


  get(id: string): Promise<Provider> {
    return this.http.get<Provider>(`${BASE_URL}/${id}`).toPromise();
  }

  create(provider: Provider): Promise<Provider> {
    return this.http.post<Provider>(BASE_URL, provider).toPromise();
  }

  update(provider: Provider): Promise<Provider> {
    return this.http.put<Provider>(`${BASE_URL}/${provider._id}`, provider).toPromise();
  }

  remove(id: string): Promise<Provider> {
    return this.http.delete<Provider>(`${BASE_URL}/${id}`).toPromise();
  }
}
