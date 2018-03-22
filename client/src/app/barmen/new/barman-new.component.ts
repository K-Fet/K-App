import { Component, OnInit } from '@angular/core';
import { FormControl, EmailValidator, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, BarmanService, KommissionService, RoleService } from '../../_services/index';
import { Barman, Kommission, Role, AssociationChanges } from '../../_models/index';

@Component({
  templateUrl: './barman-new.component.html'
})

export class BarmanNewComponent implements OnInit {

    barman: Barman = new Barman();

    kommissions: Kommission[] = new Array<Kommission>();
    roles: Role[] = new Array<Role>();
    barmen: Barman[] = new Array<Barman>();

    barmanForm: FormGroup;

    selectedGodFather: Number;
    selectedKommissions: Number[];
    selectedRoles: Number[];

    startDate = new Date();

    constructor(
        private barmanService: BarmanService,
        private kommissionService: KommissionService,
        private roleService: RoleService,
        private toasterService: ToasterService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.barmanForm = this.fb.group({
            lastName: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            nickname: new FormControl('', [Validators.required]),
            facebook: new FormControl(''),
            username: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl('', [Validators.required]),
            flow: new FormControl('', [Validators.required]),
            godFather: new FormControl(''),
            roles: new FormControl(''),
            kommissions: new FormControl(''),
            active: new FormControl('')
        });
        this.startDate.setFullYear(this.startDate.getFullYear() - 20);
    }

    ngOnInit(): void {
        // Get kommissions
        this.kommissionService.getAll().subscribe(kommissions => {
            this.kommissions = kommissions;
        });

        // Get roles
        this.roleService.getAll().subscribe(roles => {
            this.roles = roles;
        });

        // Get barmen
        this.barmanService.getAll().subscribe(barmen => {
            this.barmen = barmen;
        });
    }

    add() {
        this.prepareSaving();
        this.barmanService.create(this.barman).subscribe(() => {
            this.toasterService.showToaster('Barman créé');
            this.router.navigate(['/barmen'] );
        });
    }

    prepareSaving() {
        this.barman._embedded = {};
        this.barman.connection = {};
        Object.keys(this.barmanForm.controls).forEach(key => {
            let add: Number[] = [];
            if (this.barmanForm.controls[key].value) {
                switch (key) {
                    case 'username':
                        this.barman.connection.username = this.barmanForm.controls.username.value;
                        break;
                    case 'password':
                        this.barman.connection.password = this.barmanForm.controls.password.value;
                        break;
                    case 'godFather':
                        this.barman._embedded.godFather = this.selectedGodFather;
                        break;
                    case 'kommissions':
                        add = [];
                        this.barmanForm.controls.kommissions.value.forEach(idKommission => {
                            add.push(idKommission);
                        });
                        this.barman._embedded.kommissions = { add: add };
                        break;
                    case 'roles':
                        add = [];
                        this.barmanForm.controls.roles.value.forEach(idRole => {
                            add.push(idRole);
                        });
                        this.barman._embedded.roles = { add: add };
                        break;
                    default:
                        this.barman[key] = this.barmanForm.controls[key].value;
                        break;
                }
            }
        });
    }
}
