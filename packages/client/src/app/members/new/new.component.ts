import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms2/core';
import { getMemberModel, getMemberFromForm } from '../members.form-model';
import { Member } from '../member.model';
import { MembersService } from '../members.service';
import { ToasterService } from '../../core/services/toaster.service';
import { CURRENT_SCHOOL_YEAR } from '../../constants';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {

  ngOnInit(): void {
    this.dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result === 'create') return this.onCreate();
      if (result === 'register') return this.onRegister();
    });
  }

  @ViewChild('dialog', { static: true }) dialog: ModalComponent<string>;

  sameMembers: Member[] = [];
  optionSelected: Member | null = null;

  formGroup: FormGroup;
  model: DynamicFormModel;

  private pagination = {
    pageSize: 5,
    pageIndex: 1,
  };

  get newMember() {
    return getMemberFromForm(this.formGroup);
  }

  constructor(private formService: DynamicFormService,
              private membersService: MembersService,
              private toasterService: ToasterService) {
    this.model = getMemberModel();
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  async onNewMemberChange() {
    await this.reloadSearch();
  }

  async reloadSearch() {
    const options = {
      pageSize: this.pagination.pageSize,
      page: this.pagination.pageIndex,
      search: `${this.newMember.lastName} ${this.newMember.firstName}`,
      inactive: true,
    };
    this.sameMembers = (await this.membersService.list(options)).rows;
  }

  async onCreate() {
    const member = this.newMember;
    member.registrations = [{ year: CURRENT_SCHOOL_YEAR }];
    await this.membersService.create(member);
    this.toasterService.showToaster('Adhérent crée');
  }

  async onRegister() {
    if (this.optionSelected) {
      await this.membersService.register(this.optionSelected._id, this.optionSelected.school);
      this.toasterService.showToaster(`Adhérent ré-inscrit pour l'année ${CURRENT_SCHOOL_YEAR}`);
    }
  }
}
