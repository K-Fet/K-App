import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { getMemberModel, getMemberFromForm } from '../members.form-model';
import { Member } from '../member.model';
import { MembersService } from '../members.service';
import { MatListOption, MatSelectionList } from '@angular/material/list';
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
  @ViewChild('optionsList', null) optionsList: MatSelectionList;

  sameMembers: Member[] = [];
  optionSelected: Member[] = [];

  formGroup: FormGroup;
  model: DynamicFormModel;

  private pagination = {
    pageSize: 5,
    pageIndex: 0,
  };

  get newMember() {
    return getMemberFromForm(this.formGroup);
  }

  get selectedOption() {
    if (!this.optionsList || this.optionsList.selectedOptions.selected.length === 0) {
      return null;
    }
    return this.optionsList.selectedOptions.selected[0].value;
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

  async onOptionChange(event) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);
    }
  }

  async onCreate() {
    const member = this.newMember;
    member.registrations = [{ year: CURRENT_SCHOOL_YEAR }];
    await this.membersService.create(member);
    this.toasterService.showToaster('Adhérent crée');
  }

  async onRegister() {
    if (this.selectedOption) {
      await this.membersService.register(this.selectedOption._id, this.selectedOption.school);
      this.toasterService.showToaster(`Adhérent ré-inscrit pour l'année ${CURRENT_SCHOOL_YEAR}`);
    }
  }
}
