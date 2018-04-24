import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, BarmanService,
    KommissionService, MeService, RoleService, ToasterService } from '../../_services';
import { AssociationChanges, Barman, ConnectedUser, Kommission, Role } from '../../_models';

@Component({
    templateUrl: './barman-edit.component.html',
})

export class BarmanEditComponent implements OnInit {

    connectedUser: ConnectedUser = new ConnectedUser();

    currentBarman: Barman = new Barman();
    barman: Barman = new Barman();

    selectedGodFather: Number;
    selectedKommissions: Array<Number>;
    selectedRoles: Array<Number>;

    kommissions: Array<Kommission> = new Array<Kommission>();
    roles: Array<Role> = new Array<Role>();
    barmen: Array<Barman> = new Array<Barman>();

    barmanForm: FormGroup;

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
        function passwordMatchValidator(g: FormGroup): ValidationErrors | null {
            return g.get('newPassword').value === g.get('newPasswordConfirm').value
               ? null : { 'passwordMismatch': true };
        }

        function passwordRegExValidator(g: FormGroup): ValidationErrors | null {
            return g.get('newPassword').value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
                ? null : { 'weakPassword': true };
        }

        function passwordsValidator(g: FormGroup): ValidationErrors | null {
            const empty = [
                g.get('oldPassword').value.length > 0 ? 1 : 0,
                g.get('newPassword').value.length > 0 ? 1 : 0,
                g.get('newPasswordConfirm').value.length > 0 ? 1 : 0,
            ];
            const sum = empty.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return sum < 3 ? { 'fullPassword': true } : null;
        }

        this.barmanForm = new FormGroup({
            lastName: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            nickname: new FormControl('', [Validators.required]),
            facebook: new FormControl(''),
            username: new FormControl('', [Validators.required, Validators.email]),
            oldPassword: new FormControl(''),
            newPassword: new FormControl(''),
            newPasswordConfirm: new FormControl(''),
            dateOfBirth: new FormControl('', [Validators.required]),
            flow: new FormControl('', [Validators.required]),
            godFather: new FormControl(''),
            roles: new FormControl(''),
            kommissions: new FormControl(''),
            active: new FormControl(''),
        }, [ passwordMatchValidator, passwordRegExValidator, passwordsValidator ]);

        this.startDate.setFullYear(this.startDate.getFullYear() - 20);
    }

    getErrorMessage(): String {
        return this.barmanForm.hasError('fullPassword') ? 'Pour une modification de mot de passe, \
                tous les champs mot de passe doivent être remplis.' :
            this.barmanForm.hasError('passwordMismatch') ? 'Les nouveaux mots de passe ne correspondent pas.' :
            this.barmanForm.hasError('weakPassword') ? 'Le mot de passe doit contenir au moins 8 caractères \
                et doit avoir 1 minuscule, 1 majuscule et 1 chiffre.' :
            '';
    }

    emptyPasswords(): Boolean {
        const empty = [
            this.barmanForm.get('oldPassword').value.length > 0 ? 1 : 0,
            this.barmanForm.get('newPassword').value.length > 0 ? 1 : 0,
            this.barmanForm.get('newPasswordConfirm').value.length > 0 ? 1 : 0,
        ];
        const sum = empty.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sum === 0 ? true : false;
    }

    ngOnInit(): void {
        // Get barman information and fill up form
        this.route.params.subscribe(params => {
            this.barmanService.getById(params['id']).subscribe(barman => {
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
        this.kommissionService.getAll().subscribe(kommissions => {
            this.kommissions = kommissions;
        });

        // Get roles
        this.roleService.getAll().subscribe(roles => {
            this.roles = roles;
        });

        // Get barmen
        this.barmanService.getAll().subscribe(barmen => {
            this.barmen = barmen.filter(barman => barman.id !== this.currentBarman.id);
        });

        // Get connected user
        this.authService.$currentUser.subscribe((user: ConnectedUser) => {
            this.connectedUser = user;
        });
    }

    edit(): void {
        this.prepareSaving();
        if (this.isMe()) {
            if (this.barman) {
                this.meService.put(new ConnectedUser({ accountType: 'Barman', barman: this.barman })).subscribe(() => {
                    this.toasterService.showToaster('Modification(s) enregistrée(s)');
                    this.router.navigate(['/barmen']);
                    this.authService.me().subscribe();
                });
            }
            if (this.barmanForm.value.newPassword) {
                this.meService.resetPassword(this.currentBarman.connection.username,
                    this.barmanForm.value.newPassword,
                    this.barmanForm.value.oldPassword).subscribe(() => {
                        this.toasterService.showToaster('Modification(s) du mot de passe enregistré');
                    });
            }
        } else {
            this.barmanService.update(this.barman).subscribe(() => {
                this.toasterService.showToaster('Barman modifié');
                this.router.navigate(['/barmen']);
            });
        }
    }

    prepareSaving(): void {
        const values = this.barmanForm.value;
        Object.keys(this.currentBarman).forEach(key => {
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
                        if (!this.barman._embedded) { this.barman._embedded = {}; }
                        this.barman._embedded.godFather = this.selectedGodFather;
                    }
                    break;
                case 'kommissions':
                    if (this.barmanForm.controls.kommissions.dirty) {
                        if (!this.barman._embedded) { this.barman._embedded = {}; }
                        this.barman._embedded.kommissions = this.prepareAssociationChanges(
                            this.currentBarman.kommissions, this.barmanForm.controls.kommissions.value);
                    }
                    break;
                case 'roles':
                    if (this.barmanForm.controls.roles.dirty) {
                        if (!this.barman._embedded) { this.barman._embedded = {}; }
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
        // Prevent empty barman due to password update
        this.barman = Object.keys(this.barman).length > 0 ? this.barman : undefined;
    }

    prepareAssociationChanges(current, updated): AssociationChanges {
        const add: Array<Number> = [];
        const remove: Array<Number> = [];
        updated.forEach(aId => {
            if (!current.map(a => a.id).includes(aId)) {
                add.push(aId);
            }
        });
        current.map(a => {
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
