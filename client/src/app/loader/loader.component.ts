import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderService } from '../_services';
import { LoaderState } from '../_models/loader';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'http-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState
      .pipe(
        delay(0),
      ).subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
