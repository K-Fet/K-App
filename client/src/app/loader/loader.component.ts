import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService } from '../_services/loader.service';
import { LoaderState } from '../_models/loader';

@Component({
    selector: 'http-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css'],
})
export class LoaderComponent implements OnInit, OnDestroy {

    show = false;

    private subscription: Subscription;

    constructor(private loaderService: LoaderService) { }

    ngOnInit(): void {
        this.subscription = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
