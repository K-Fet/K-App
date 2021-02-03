import { StockEvent } from './stock-events.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { StockEventsService } from '../api-services/stock-events.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

export class StockEventsDataSource implements DataSource<StockEvent> {
  private stockEventsSubject = new BehaviorSubject<StockEvent[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public total = 0;
  public pageSize = 0;

  constructor(private stockEventsService: StockEventsService) {}

  connect(_collectionViewer: CollectionViewer): Observable<StockEvent[]> {
    return this.stockEventsSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.stockEventsSubject.complete();
    this.loadingSubject.complete();
  }

  async loadStockEvents(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows, total, pageSize } = await this.stockEventsService.list(options);
      this.total = total;
      this.pageSize = pageSize;
      this.stockEventsSubject.next(rows);
    } catch (e) {
      this.stockEventsSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
