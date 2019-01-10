import { Shelf } from './shelves.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShelvesService } from './shelves.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MoleculerListOptions } from '../../shared/models/MoleculerWrapper';

export class ShelvesDataSource implements DataSource<Shelf> {
  private shelvesSubject = new BehaviorSubject<Shelf[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private shelvesService: ShelvesService) {}

  connect(_collectionViewer: CollectionViewer): Observable<Shelf[]> {
    return this.shelvesSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.shelvesSubject.complete();
    this.loadingSubject.complete();
  }

  async loadShelves(options: MoleculerListOptions = {}) {
    this.loadingSubject.next(true);
    try {
      const { rows: shelves } = await this.shelvesService.list(options);
      this.shelvesSubject.next(shelves);
    } catch (e) {
      this.shelvesSubject.next([]);
    }
    this.loadingSubject.next(false);
  }

}
