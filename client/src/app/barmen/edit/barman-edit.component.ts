import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, BarmanService } from '../../_services/index';
import { Barman } from '../../_models/Barman';

@Component({
  templateUrl: './barman-edit.component.html'
})

export class BarmanEditComponent implements OnInit {

    barman: Barman = new Barman;

    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    nicknameFormControl: FormControl = new FormControl('', [Validators.required]);
    usernameFormControl: FormControl = new FormControl('', [Validators.required]);
    dateOfBirthFormControl: FormControl = new FormControl('', [Validators.required]);
    flowFormControl: FormControl = new FormControl('', [Validators.required]);
    godFatherFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private barmanService: BarmanService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
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

    edit() {
        this.barmanService.update(this.barman).subscribe(() => {
            this.toasterService.showToaster('Barman modifié', 'Fermer');
            this.router.navigate(['/barmen'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
