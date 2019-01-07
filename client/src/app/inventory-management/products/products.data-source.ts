import { Product } from './product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsService } from '../api-services/products.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

export class ProductsDataSource implements DataSource<Product> {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private productsService: ProductsService) {}

  connect(_collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.productsSubject.complete();
    this.loadingSubject.complete();
  }

  async loadProducts(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows: products } = await this.productsService.list(options);
      this.productsSubject.next(products);
    } catch (e) {
      this.productsSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
