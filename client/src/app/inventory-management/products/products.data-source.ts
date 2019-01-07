import { Product } from './product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsService } from './products.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

export class ProductsDataSource implements DataSource<Product> {
  private providersSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private productsService: ProductsService) {}

  connect(_collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.providersSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.providersSubject.complete();
    this.loadingSubject.complete();
  }

  async loadProducts(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows: providers } = await this.productsService.list(options);
      this.providersSubject.next(providers);
    } catch (e) {
      this.providersSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
