import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, BarmanService } from '../../_services/index';
import { Barman } from '../../_models/Barman';

@Component({
  templateUrl: './barman-new.component.html'
})

export class BarmanNewComponent implements OnInit {

    lastName: string;
    firstName: string;
    nickname: string;
    username: string;
    facebook: string;
    dateOfBirth: Date;
    flow: string;
    godFather: number;

    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    nicknameFormControl: FormControl = new FormControl('', [Validators.required]);
    usernameFormControl: FormControl = new FormControl('', [Validators.required]);
    dateOfBirthFormControl: FormControl = new FormControl('', [Validators.required]);
    flowFormControl: FormControl = new FormControl('', [Validators.required]);
    godFatherFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private barmanService: BarmanService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

    }

    add() {
        const barman = new Barman();
        barman.firstName = this.firstName;
        barman.lastName = this.lastName;
        barman.nickname = this.nickname;
        barman.username = this.username;
        barman.dateOfBirth = this.dateOfBirth;
        barman.flow = this.flow;
        barman.godFather = this.godFather;

        if (this.facebook) {
            barman.facebook = this.facebook;
        }

        console.log(barman);

        this.barmanService.create(barman).subscribe(() => {
            this.toasterService.showToaster('Barman créé', 'Fermer');
            this.router.navigate(['/barmen'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
