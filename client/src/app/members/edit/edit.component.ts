import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../member.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { ToasterService } from '../../core/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../members.service';
import { getMemberFromForm, getMemberModel } from '../members.form-model';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  @ViewChild('dialog') dialog: ModalComponent<Member>;

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalMember: Member;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private membersService: MembersService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { member: Member }) => {
      this.originalMember = data.member;
      this.model = getMemberModel(this.originalMember);
      this.formGroup = this.formService.createFormGroup(this.model);
    });

    this.dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      return this.onEdit();
    });
  }

  async onEdit() {
    const updatedMember = getMemberFromForm(this.formGroup, this.originalMember);
    await this.membersService.update(updatedMember);
    this.toasterService.showToaster('Adhérent mis à jour');
  }
}
