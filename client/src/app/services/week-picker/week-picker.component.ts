import { Component } from '@angular/core';
import { ServiceService } from '../../_services/index';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Moment } from 'moment';

@Component({
    selector: 'app-week-picker',
    templateUrl: './week-picker.component.html'
})

export class WeekPickerComponent implements OnInit {

    weekInterval: Number;
    week: { start: Moment, end: Moment };

    ngOnInit(): void {
        this.serviceService.$weekInterval.subscribe(weekInterval => {
            this.weekInterval = weekInterval;
        });
        this.serviceService.getWeek().subscribe(week => {
            this.week = week;
        });
    }

    constructor( private serviceService: ServiceService) {}

    next() {
        this.serviceService.$weekInterval.next(+this.weekInterval + 1);
    }

    previous() {
        this.serviceService.$weekInterval.next(+this.weekInterval - 1);
    }
}