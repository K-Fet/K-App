import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shelf } from '../shelf.model';
import { getShelfFromForm, getShelfModel } from '../shelves.form-model';
import { ToasterService } from '../../../core/services/toaster.service';
import { ShelvesService } from '../../api-services/shelves.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  model: DynamicFormModel;

  originalShelf: Shelf;

  constructor(private formService: DynamicFormService,
              private toasterService: ToasterService,
              private shelvesService: ShelvesService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup([]);

    this.route.data.subscribe((data: { shelf: Shelf }) => {
      this.originalShelf = data.shelf;
      this.model = getShelfModel(this.originalShelf);
      this.formGroup = this.formService.createFormGroup(this.model);
    });
  }

  async onNgSubmit() {
    const updatedShelf = getShelfFromForm(this.formGroup, this.originalShelf);
    await this.shelvesService.update(updatedShelf);
    this.toasterService.showToaster('Rayon mis à jour');
    this.router.navigate(['/inventory-management/shelves']);
  }
}
