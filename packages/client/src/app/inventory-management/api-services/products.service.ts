import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../products/product.model';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { createHttpParams } from '../../shared/utils';
import { toURL } from '../../core/api-services/api-utils';

const BASE_URL = toURL('v2/inventory-management/products');

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions = {}): Promise<MoleculerList<Product>> {
    return this.http.get<MoleculerList<Product>>(
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

  async listAll(): Promise<Product[]> {
    return (await this.list({ pageSize: 1000 })).rows;
  }

  get(id: string): Promise<Product> {
    // Always populate provider and shelf
    return this.http.get<Product>(`${BASE_URL}/${id}?populate=provider,shelf`).toPromise();
  }

  create(product: Product): Promise<Product> {
    return this.http.post<Product>(BASE_URL, product).toPromise();
  }

  update(product: Product): Promise<Product> {
    return this.http.put<Product>(`${BASE_URL}/${product._id}`, product).toPromise();
  }

  remove(id: string): Promise<Product> {
    return this.http.delete<Product>(`${BASE_URL}/${id}`).toPromise();
  }
}
