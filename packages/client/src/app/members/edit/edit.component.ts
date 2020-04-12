import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Member } from '../member.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@k-fet/ng-dynamic-forms-core';
import { ToasterService } from '../../core/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../members.service';
import { getMemberFromForm, getMemberModel } from '../members.form-model';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  @ViewChild('dialog', { static: true }) dialog: ModalComponent<string>;

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalMember: Member;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private membersService: MembersService,
              private route: ActivatedRoute,
              private cdref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { member: Member }) => {
      this.originalMember = data.member;
      this.model = getMemberModel(this.originalMember);
      this.formGroup = this.formService.createFormGroup(this.model);
    });

    this.dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result === 'save') return this.onEdit();
      if (result === 'delete') return this.onDelete();
    });
  }

  // Fix ExpressionChangedAfterItHasBeenCheckedError
  // https://github.com/angular/angular/issues/23657#issuecomment-526913914
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  async onEdit() {
    const updatedMember = getMemberFromForm(this.formGroup, this.originalMember);
    await this.membersService.update(updatedMember);
    this.toasterService.showToaster('Adhérent mis à jour');
  }

  async onDelete() {
    await this.membersService.remove(this.originalMember._id);
    this.toasterService.showToaster('Adhérent supprimé');
  }

  getAllYears() {
    if (!this.originalMember) return '...';
    return this.originalMember.registrations
      .map(r => `${r.year}-${r.year + 1}`)
      .join(', ');
  }
}
