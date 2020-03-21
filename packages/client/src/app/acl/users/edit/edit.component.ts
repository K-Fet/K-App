import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../core/api-services/users.service';
import { User } from '../../../shared/models';
import { getUserFromForm, getUserModel } from '../users.form-model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, AfterContentChecked {

  @ViewChild('dialog', { static: true }) dialog: ModalComponent<string>;

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalUser: User;

  constructor(private formService: DynamicFormService,
    private toasterService: ToasterService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { user: User }) => {
      this.originalUser = data.user;
      this.model = getUserModel(this.originalUser.accountType, this.usersService, this.originalUser);
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

  async onEdit(): Promise<void> {
    const updatedUser = getUserFromForm(this.formGroup, this.originalUser.accountType, this.originalUser);
    await this.usersService.update(updatedUser);
    this.toasterService.showToaster('Utilisateur mis à jour');
  }

  async onDelete(): Promise<void> {
    await this.usersService.remove(this.originalUser._id);
    this.toasterService.showToaster('Utilisateur supprimé');
  }
}
