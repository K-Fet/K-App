import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Kommission } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { KommissionService } from '../../_services/kommission.service';

@Component({
  templateUrl: './kommission-edit.component.html'
})

export class KommissionEditComponent implements OnInit {
    id: String;
    name: String;
    description: String;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private kommissionService: KommissionService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.kommissionService.getById(+this.id)
            .subscribe(kommission => {
                this.name = kommission.name as String;
                this.description = kommission.description;
            });
        });
    }

    edit(): void {
        const kommission = new Kommission();
        kommission.id = +this.id;
        kommission.name = this.name;
        kommission.description = this.description;
        this.kommissionService.update(kommission)
        .subscribe(() => {
            this.toasterService.showToaster('Kommission modifiée');
            this.router.navigate(['/kommissions']);
        });
    }
}
