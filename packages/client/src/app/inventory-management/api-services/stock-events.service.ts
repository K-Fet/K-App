import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockEvent } from '../stock-events/stock-events.model';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { createHttpParams } from '../../shared/utils';
import { toURL } from '../../core/api-services/api-utils';

const BASE_URL = toURL('v2/inventory-management/stock-events');

@Injectable()
export class StockEventsService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions = {}): Promise<MoleculerList<StockEvent>> {
    return this.http.get<MoleculerList<StockEvent>>(
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
  
  create(stockEvent: StockEvent): Promise<StockEvent> {
    return this.http.post<StockEvent>(BASE_URL, stockEvent).toPromise();
  }

  get(id: string): Promise<StockEvent> {
    // Always populate shelf with products
    return this.http.get<StockEvent>(`${BASE_URL}/${id}?populate=product`).toPromise();
  }

  update(event: StockEvent): Promise<StockEvent> {
    return this.http.put<StockEvent>(`${BASE_URL}/${event._id}`, event).toPromise();
  }

  remove(id: string): Promise<StockEvent> {
    return this.http.delete<StockEvent>(`${BASE_URL}/${id}`).toPromise();
  }
}