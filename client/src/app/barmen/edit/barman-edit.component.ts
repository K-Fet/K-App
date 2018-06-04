import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService, BarmanService,
  KommissionService, MeService, RoleService, ToasterService,
} from '../../_services';
import { AssociationChanges, Barman, ConnectedUser, Kommission, Role } from '../../_models';

@Component({
  templateUrl: './barman-edit.component.html',
})

export class BarmanEditComponent implements OnInit {

  connectedUser: ConnectedUser = new ConnectedUser();

  currentBarman: Barman = new Barman();
  barman: Barman = new Barman();

  selectedGodFather: Number;
  selectedKommissions: Number[];
  selectedRoles: Number[];

  kommissions: Kommission[] = [];
  roles: Role[] = [];
  barmen: Barman[] = [];

  barmanForm: FormGroup;

  passwordForm: FormGroup;

  oldPassword: String;

  startDate = new Date();

  constructor(private barmanService: BarmanService,
              private kommissionService: KommissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private meService: MeService) {
    this.createForm();
  }

  createForm(): void {

    this.barmanForm = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      nickname: new FormControl('', [Validators.required]),
      facebook: new FormControl('', [Validators.pattern(
        /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w\-]*\/)*([\w\-.]+)(\/)?/i)]),
      username: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      flow: new FormControl('', [Validators.required]),
      godFather: new FormControl(''),
      roles: new FormControl(''),
      kommissions: new FormControl(''),
      active: new FormControl(''),
    });

    function passwordMatchValidator(g: FormGroup): ValidationErrors | null {
      return g.get('newPassword').value === g.get('newPasswordConfirm').value
        ? null : { passwordMismatch: true };
    }

    function passwordRegExValidator(g: FormGroup): ValidationErrors | null {
      return g.get('newPassword').value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
        ? null : { weakPassword: true };
    }

    this.passwordForm = new FormGroup(
      {
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        newPasswordConfirm: new FormControl('', [Validators.required]),
      },
      [passwordMatchValidator, passwordRegExValidator],
    );

    this.startDate.setFullYear(this.startDate.getFullYear() - 20);
  }

  getErrorMessage(): String {
    if (this.passwordForm.hasError('passwordMismatch')) {
      return 'Les nouveaux mots de passe ne correspondent pas.';
    }

    if (this.passwordForm.hasError('weakPassword')) {
      return 'Le nouveau mot de passe doit contenir au moins 8 caractères ' +
        'et doit avoir 1 minuscule, 1 majuscule et 1 chiffre.';
    }
    return '';
  }

  ngOnInit(): void {
    // Get barman information and fill up form
    this.route.params.subscribe((params) => {
      this.barmanService.getById(params['id']).subscribe((barman) => {
        this.barman.id = barman.id;
        this.currentBarman = barman;

        this.barmanForm.controls.lastName.setValue(barman.lastName);
        this.barmanForm.controls.firstName.setValue(barman.firstName);
        this.barmanForm.controls.nickname.setValue(barman.nickname);
        this.barmanForm.controls.facebook.setValue(barman.facebook);
        this.barmanForm.controls.username.setValue(barman.connection.username);
        this.barmanForm.controls.dateOfBirth.setValue(barman.dateOfBirth);
        this.barmanForm.controls.flow.setValue(barman.flow);
        this.barmanForm.controls.active.setValue(barman.active);

        this.selectedGodFather = barman.godFather ? barman.godFather.id : undefined;
        this.selectedKommissions = barman.kommissions.map(k => k.id);
        this.selectedRoles = barman.roles.map(r => r.id);
      });
    });

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
      this.barmen = barmen.filter(barman => barman.id !== this.currentBarman.id);
    });

    // Get connected user
    this.authService.$currentUser.subscribe((user: ConnectedUser) => {
      this.connectedUser = user;
    });
  }

  updatePassword(): void {
    this.authService.definePassword(
      this.currentBarman.connection.username,
      this.passwordForm.value.newPassword,
      null,
      this.passwordForm.value.oldPassword).subscribe(() => {
        this.toasterService.showToaster('Modification du mot de passe enregistré');
        this.router.navigate(['/login']);
      },
    );
  }

  edit(): void {
    this.prepareSaving();
    if (Object.keys(this.barman).length > 0) {
      if (this.isMe()) {
        this.meService.put(new ConnectedUser({
          accountType: 'Barman',
          barman: this.barman,
        })).subscribe(() => {
          this.toasterService.showToaster('Modification(s) enregistrée(s)');
          this.router.navigate(['/barmen']);
          this.authService.me().subscribe();
        });
      } else {
        this.barmanService.update(this.barman).subscribe(() => {
          this.toasterService.showToaster('Barman modifié');
          this.router.navigate(['/barmen']);
        });
      }
    } else {
      this.toasterService.showToaster('Les données n\'ont pas été modifiées. Merci d\'essayer à nouveau');
    }
  }

  prepareSaving(): void {
    const values = this.barmanForm.value;
    Object.keys(this.currentBarman).forEach((key) => {
      switch (key) {
        case 'connection':
          if (values.username !== this.currentBarman.connection.username) {
            this.barman.connection = {
              ...this.barman.connection,
              username: values.username,
            };
          }
          break;
        case 'godFather':
          if (this.barmanForm.controls.godFather.dirty) {
            if (!this.barman._embedded) {
              this.barman._embedded = {};
            }
            this.barman._embedded.godFather = this.selectedGodFather;
          }
          break;
        case 'kommissions':
          if (this.barmanForm.controls.kommissions.dirty) {
            if (!this.barman._embedded) {
              this.barman._embedded = {};
            }
            this.barman._embedded.kommissions = this.prepareAssociationChanges(
              this.currentBarman.kommissions, this.barmanForm.controls.kommissions.value);
          }
          break;
        case 'roles':
          if (this.barmanForm.controls.roles.dirty) {
            if (!this.barman._embedded) {
              this.barman._embedded = {};
            }
            this.barman._embedded.roles = this.prepareAssociationChanges(
              this.currentBarman.roles, this.barmanForm.controls.roles.value);
          }
          break;
        default:
          if (this.barmanForm.controls[key] && this.currentBarman[key] !== this.barmanForm.controls[key].value) {
            this.barman[key] = this.barmanForm.controls[key].value;
          }
          break;
      }
    });
  }

  prepareAssociationChanges(current, updated): AssociationChanges {
    const add: Number[] = [];
    const remove: Number[] = [];
    updated.forEach((aId) => {
      if (!current.map(a => a.id).includes(aId)) {
        add.push(aId);
      }
    });
    current.map((a) => {
      if (!updated.includes(a.id)) {
        remove.push(a.id);
      }
    });
    return { add, remove };
  }

  isMe(): Boolean {
    return this.connectedUser && this.connectedUser.barman
      && this.connectedUser.barman.id === this.currentBarman.id;
  }
}
