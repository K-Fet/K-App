import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { ToasterService } from '../../core/services/toaster.service';
import { MembersService } from '../members.service';
import { getMemberFromForm, getMemberModel } from '../members.form-model';
import { CURRENT_SCHOOL_YEAR } from '../../constants';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  @ViewChild('dialog', { static: true }) dialog: ModalComponent<string>;

  formGroup: FormGroup;
  model: DynamicFormModel;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private membersService: MembersService) { }

  ngOnInit() {
    this.model = getMemberModel();
    this.formGroup = this.formService.createFormGroup(this.model);

    this.dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result === 'create') return this.onCreate();
    });
  }

  async onCreate() {
    const newMember = getMemberFromForm(this.formGroup);
    // Append this year registration
    newMember.registrations = [{ year: CURRENT_SCHOOL_YEAR }];

    await this.membersService.create(newMember);
    this.toasterService.showToaster('Adhérent créé');
  }
}
