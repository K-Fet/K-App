import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getBarmanFromForm, getBarmanModel } from '../barmen.form-model';
import { BarmanService } from '../../core/api-services/barman.service';
import { RoleService } from '../../core/api-services/role.service';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Barman } from '../../shared/models';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalBarman: Barman;

  constructor(private formService: DynamicFormService,
              private barmanService: BarmanService,
              private kommissionService: KommissionService,
              private roleService: RoleService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { barman: Barman }) => {
      this.originalBarman = data.barman;
      this.model = getBarmanModel(
        this.barmanService.getAll(),
        this.kommissionService.getAll(),
        this.roleService.getAll(),
        this.originalBarman,
      );
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  onNgSubmit() {
    this.barmanService.update(getBarmanFromForm(this.formGroup, this.originalBarman)).subscribe(() => {
      this.toasterService.showToaster('Barman créé');
      this.router.navigate(['/barmen']);
    });
  }
}
