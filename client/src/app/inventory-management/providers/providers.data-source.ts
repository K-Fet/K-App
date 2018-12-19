import { Provider } from './provider.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProvidersService } from './providers.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

export class ProvidersDataSource implements DataSource<Provider> {
  private providersSubject = new BehaviorSubject<Provider[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private providersService: ProvidersService) {}

  connect(_collectionViewer: CollectionViewer): Observable<Provider[]> {
    return this.providersSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.providersSubject.complete();
    this.loadingSubject.complete();
  }

  async loadProviders(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows: providers } = await this.providersService.list(options);
      this.providersSubject.next(providers);
    } catch (e) {
      this.providersSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
