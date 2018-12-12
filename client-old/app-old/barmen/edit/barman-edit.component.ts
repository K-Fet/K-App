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

  selectedGodFather: number;
  selectedKommissions: number[];
  selectedRoles: number[];

  kommissions: Kommission[] = [];
  roles: Role[] = [];
  barmen: Barman[] = [];

  barmanForm: FormGroup;

  passwordForm: FormGroup;

  oldPassword: string;

  startDate = new Date();

  constructor(private barmanService: BarmanService,
              private kommissionService: KommissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private meService: MeService) {
  }

  edit(): void {
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
}
