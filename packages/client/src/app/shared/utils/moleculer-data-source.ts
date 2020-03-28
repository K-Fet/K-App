import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerList, MoleculerListOptions } from '../models/MoleculerWrapper';
import { RawHttpParams } from './index';

interface MoleculerService<Model, AdditionalFilterFields> {
  list(options: AdditionalFilterFields & MoleculerListOptions): Promise<MoleculerList<Model>>;
}

export class MoleculerDataSource<Model, AdditionalFilterFields extends RawHttpParams = {}> implements DataSource<Model> {
  private modelSubject = new BehaviorSubject<Model[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public total = 0;
  public pageSize = 0;

  constructor(private service: MoleculerService<Model, AdditionalFilterFields>) {}

  connect(_collectionViewer: CollectionViewer): Observable<Model[]> {
    return this.modelSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.modelSubject.complete();
    this.loadingSubject.complete();
  }

  async load(options?: AdditionalFilterFields & MoleculerListOptions): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const { rows, total, pageSize } = await this.service.list(options);
      this.total = total;
      this.pageSize = pageSize;
      this.modelSubject.next(rows);
    } catch (e) {
      this.modelSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
