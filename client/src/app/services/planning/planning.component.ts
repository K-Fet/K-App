import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../_services/index';
import { Service } from '../../_models/index';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
})

export class PlanningComponent implements OnInit {

    days: Day[] = new Array<Day>();
    services: Service[];
    start: Date = new Date();
    end: Date = new Date();
    weekday: String[] = new Array<String>();

    constructor(private serviceService: ServiceService) {}

    updateServicesDetails(day: Day) {
        this.serviceService.get(day.date, day.date).subscribe(services => {
            this.services = services.map(service => {
                return this.serviceService.getById(service.id).subscribe(serviceExtended => {
                    return serviceExtended;
                });
            });
        });
    }

    ngOnInit() {
        this.weekday[0] = 'Dim';
        this.weekday[1] = 'Lun';
        this.weekday[2] = 'Mar';
        this.weekday[3] = 'Mer';
        this.weekday[4] = 'Jeu';
        this.weekday[5] = 'Ven';
        this.weekday[6] = 'Sam';

        // TODO: improve initial value of start and end variable
        this.start.setDate( this.start.getDate() - 7 );
        this.end.setDate( this.end.getDate() + 7 );
        this.serviceService.get(this.start, this.end).subscribe(services => {
            services.forEach(service => {
                const startAt = new Date(service.startAt);
                const day = {
                    name: this.weekday[startAt.getDay().toString()],
                    date: startAt
                };
                if (this.days.map(currentDay => currentDay.name).indexOf(day.name) === -1) {
                    this.days.push(day);
                }
            });
            this.updateServicesDetails(this.days[0]);
        });
    }
}

interface Day {
    name: String;
    date: Date;
}
