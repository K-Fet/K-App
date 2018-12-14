import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getBarmanFromForm, getBarmanModel } from '../barmen.form-model';
import { BarmanService } from '../../core/api-services/barman.service';
import { RoleService } from '../../core/api-services/role.service';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Barman, ConnectedUser } from '../../shared/models';
import { AuthService } from '../../core/api-services/auth.service';
import { map } from 'rxjs/operators';
import { MeService } from '../../core/api-services/me.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalBarman: Barman;
  connectedUser: ConnectedUser;

  constructor(private formService: DynamicFormService,
              private authService: AuthService,
              private meService: MeService,
              private barmanService: BarmanService,
              private kommissionService: KommissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.authService.$currentUser.subscribe(user => this.connectedUser = user);
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { barman: Barman }) => {
      this.originalBarman = data.barman;
      this.model = getBarmanModel(
        this.barmanService.getAll().pipe(map(barmen => barmen.filter(b => b.id !== this.originalBarman.id))),
        this.kommissionService.getAll(),
        this.roleService.getAll(),
        this.originalBarman,
      );
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  isMe(): boolean {
    if (!this.connectedUser || !this.originalBarman || !this.originalBarman.connection) return false;
    const { id: connectedId } = this.connectedUser.getConnection();
    const { id: barmanId } = this.originalBarman.connection;
    return connectedId === barmanId;
  }

  onNgSubmit() {
    const updatedBarman = getBarmanFromForm(this.formGroup, this.originalBarman);
    if (this.isMe()) {
      this.meService.put(new ConnectedUser({
        accountType: 'Barman',
        barman: updatedBarman,
      })).subscribe(() => {
        this.toasterService.showToaster('Modification(s) enregistrée(s)');
        this.router.navigate(['/home']);
        this.authService.me();
      });
    } else {
      this.barmanService.update(updatedBarman).subscribe(() => {
        this.toasterService.showToaster('Barman mis à jour');
        this.router.navigate(['/barmen']);
      });
    }
  }
}
