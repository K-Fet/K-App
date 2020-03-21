import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { UsersService } from '../../../core/api-services/users.service';
import { getUserFromForm, getUserModel } from '../users.form-model';
import { AccountType } from '../../../shared/models';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToasterService } from '../../../core/services/toaster.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  @ViewChild('dialog', { static: true }) dialog: ModalComponent<string>;

  formGroup: FormGroup;
  model: DynamicFormModel;

  accountType: AccountType = AccountType.BARMAN;

  constructor(private formService: DynamicFormService,
    private usersService: UsersService,
    private toasterService: ToasterService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const type = params.get('accountType');
      if (type === AccountType.SERVICE) {
        this.accountType = type;
      }
      this.model = getUserModel(this.accountType, this.usersService);
      this.formGroup = this.formService.createFormGroup(this.model);
    });

    this.dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result === 'create') return this.onCreate();
    });
  }

  async onCreate(): Promise<void> {
    const user = getUserFromForm(this.formGroup, this.accountType);
    await this.usersService.create(user);
    this.toasterService.showToaster('Utilisateur créé');
  }
}
