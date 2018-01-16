import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Kommission } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { KommissionService } from '../../_services/kommission.service';

@Component({
  templateUrl: './kommission-edit.component.html',
})

export class KommissionEditComponent implements OnInit {
    id: string;
    name: string;
    description: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private kommissionService: KommissionService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.kommissionService.getById(+this.id).subscribe(role => {
                this.name = role.name;
                this.description = role.description;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const kommission = new Kommission();
        kommission.id = +this.id;
        kommission.name = this.name;
        kommission.description = this.description;
        this.kommissionService.update(kommission).subscribe(() => {
            this.toasterService.showToaster('Kommission modifiée', 'Fermer');
            this.router.navigate(['/roles']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
