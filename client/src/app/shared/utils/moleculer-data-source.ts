import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerList, MoleculerListOptions } from '../models/MoleculerWrapper';

interface MoleculerService<Model> {
  list(options: MoleculerListOptions): Promise<MoleculerList<Model>>;
}

export class MoleculerDataSource<Model> implements DataSource<Model> {
  private modelSubject = new BehaviorSubject<Model[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private service: MoleculerService<Model>) {}

  connect(_collectionViewer: CollectionViewer): Observable<Model[]> {
    return this.modelSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.modelSubject.complete();
    this.loadingSubject.complete();
  }

  async load(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows } = await this.service.list(options);
      this.modelSubject.next(rows);
    } catch (e) {
      this.modelSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
