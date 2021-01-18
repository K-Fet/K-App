import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shelf } from '../shelves/shelf.model';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { createHttpParams } from '../../shared/utils';
import { toURL } from '../../core/api-services/api-utils';

const BASE_URL = toURL('v2/inventory-management/shelves');

@Injectable()
export class ShelvesService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions = {}): Promise<MoleculerList<Shelf>> {
    return this.http.get<MoleculerList<Shelf>>(
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

  async listAll(): Promise<Shelf[]> {
    return (await this.list({pageSize: 100})).rows; 
  }

  get(id: string): Promise<Shelf> {
    // Always populate shelf with products
    return this.http.get<Shelf>(`${BASE_URL}/${id}?populate=products`).toPromise();
  }

  create(shelf: Shelf): Promise<Shelf> {
    return this.http.post<Shelf>(BASE_URL, shelf).toPromise();
  }

  update(shelf: Shelf): Promise<Shelf> {
    return this.http.put<Shelf>(`${BASE_URL}/${shelf._id}`, shelf).toPromise();
  }

  remove(id: string): Promise<Shelf> {
    return this.http.delete<Shelf>(`${BASE_URL}/${id}`).toPromise();
  }
}
