import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarmanService, KommissionService, RoleService, ToasterService } from '../../_services';
import { Barman, Kommission, Role } from '../../_models';

@Component({
  templateUrl: './barman-new.component.html',
})

export class BarmanNewComponent implements OnInit {

  barman: Barman = new Barman();

  kommissions: Kommission[] = [];
  roles: Role[] = [];
  barmen: Barman[] = [];

  barmanForm: FormGroup;

  selectedGodFather: number;
  selectedKommissions: number[];
  selectedRoles: number[];

  startDate = new Date();

  constructor(
    private barmanService: BarmanService,
    private kommissionService: KommissionService,
    private roleService: RoleService,
    private toasterService: ToasterService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.barmanForm = this.fb.group({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      nickname: new FormControl('', [Validators.required]),
      facebook: new FormControl('', [Validators.pattern(
        /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w\-]*\/)*([\w\-.]+)(\/)?/i)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      flow: new FormControl('', [Validators.required]),
      godFather: new FormControl(''),
      roles: new FormControl(''),
      kommissions: new FormControl(''),
    });
    this.startDate.setFullYear(this.startDate.getFullYear() - 20);
  }

  ngOnInit(): void {
    // Get kommissions
    this.kommissionService.getAll().subscribe((kommissions) => {
      this.kommissions = kommissions;
    });

    // Get roles
    this.roleService.getAll().subscribe((roles) => {
      this.roles = roles;
    });

    // Get barmen
    this.barmanService.getAll().subscribe((barmen) => {
      this.barmen = barmen;
    });
  }

  add(): void {
    this.prepareSaving();
    this.barmanService.create(this.barman).subscribe(() => {
      this.toasterService.showToaster('Barman créé');
      this.router.navigate(['/barmen']);
    });
  }

  prepareSaving(): void {
    this.barman._embedded = {};
    this.barman.connection = {};
    Object.keys(this.barmanForm.controls).forEach((key) => {
      let add: number[] = [];
      if (this.barmanForm.controls[key].value) {
        switch (key) {
          case 'email':
            this.barman.connection.email = this.barmanForm.controls.email.value;
            break;
          case 'godFather':
            this.barman._embedded.godFather = this.selectedGodFather;
            break;
          case 'kommissions':
            add = [];
            this.barmanForm.controls.kommissions.value.forEach((idKommission) => {
              add.push(idKommission);
            });
            this.barman._embedded.kommissions = { add };
            break;
          case 'roles':
            add = [];
            this.barmanForm.controls.roles.value.forEach((idRole) => {
              add.push(idRole);
            });
            this.barman._embedded.roles = { add };
            break;
          default:
            this.barman[key] = this.barmanForm.controls[key].value;
            break;
        }
      }
    });
  }
}