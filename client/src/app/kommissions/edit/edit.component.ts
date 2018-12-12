import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KommissionService } from '../../core/api-services/kommission.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Kommission } from '../../shared/models';
import { getKommissionFromForm, getKommissionModel } from '../kommissions.form-model';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalKommission: Kommission;

  constructor(private formService: DynamicFormService,
              private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { kommission: Kommission }) => {
      this.originalKommission = data.kommission;
      this.model = getKommissionModel(this.originalKommission);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  onNgSubmit() {
    const updatedBarman = getKommissionFromForm(this.formGroup, this.originalKommission);
    this.kommissionService.update(updatedBarman).subscribe(() => {
      this.toasterService.showToaster('Kommission mise à jour');
      this.router.navigate(['/kommissions']);
    });
  }
}
