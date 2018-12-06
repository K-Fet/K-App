import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { LoaderState } from '../../shared-old/models/loader';

@Injectable()
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  show(): void {
    this.loaderSubject.next({ show: true } as LoaderState);
  }

  hide(): void {
    this.loaderSubject.next({ show: false } as LoaderState);
  }
}
