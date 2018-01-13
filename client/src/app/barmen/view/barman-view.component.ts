import { Component, OnInit } from '@angular/core';
import { BarmanService, ToasterService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Barman } from '../../_models/Barman';

@Component({
    templateUrl: './barman-view.component.html',
})

export class BarmanViewComponent implements OnInit {

    barman: Barman = new Barman;

    constructor(
        private barmanService: BarmanService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.barman.id = params['id'];
            this.barmanService.getById(+this.barman.id).subscribe(barman => {
                this.barman = barman;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }
}
