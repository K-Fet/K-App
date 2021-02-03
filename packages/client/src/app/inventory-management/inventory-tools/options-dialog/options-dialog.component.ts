import { Component, Inject } from '@angular/core';
import { Provider } from '../../providers/provider.model';
import { ProvidersService } from 'src/app/inventory-management/api-services/providers.service';
import { DynamicFormModel, DynamicSelectModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { from } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shelf } from '../../shelves/shelf.model';
import { ShelvesService } from '../../api-services/shelves.service';

@Component({
  selector: 'app-options-dialog',
  templateUrl: './options-dialog.component.html',
  styleUrls: ['./options-dialog.component.scss']
})
export class OptionsDialogComponent{

  public providers: Promise<Provider[]>;
  public shelves: Promise<Shelf[]>;
  public eventsType: string[];
  public formGroup: FormGroup;

  public stopDialog = false;

  public optionsFormModel: DynamicFormModel;

  constructor(
    public dialogRef: MatDialogRef<OptionsDialogComponent>,
    private readonly providersService: ProvidersService,
    private readonly shelvesService: ShelvesService,
    private formService: DynamicFormService,
    @Inject(MAT_DIALOG_DATA) public data: {
      providers: boolean;
      types: boolean;
      shelves: boolean;
      shelf: Shelf;
      productName: string;
    }
  ){

    const optionMap = (valueField, labelField) => arr => arr.map(b => ({
      value: b[valueField],
      label: b[labelField],
    }));

    
    
    if(this.data.providers){
      this.providers = this.providersService.listAll();

      this.optionsFormModel = [
        new DynamicSelectModel<string>({
          id: 'provider',
          label: 'Fournisseur',
          validators: { required: null },
          options: from(this.providers.then(optionMap('_id', 'name')),
          ),
        }),
      ]
    }
  
    if(this.data.types){
      const eventTypes = [
        {
          label: 'Vente',
          value: 'Transaction',
        }, 
        {
          label: 'Réception',
          value: 'Delivery',
        }
      ];

      this.optionsFormModel = [ 
        new DynamicSelectModel<string>({
          id: 'type',
          label: 'Type de l\'évènement',
          options: eventTypes,
          validators: { required: null },
        }),
      ]
    }

    if(this.data.shelves){
      this.shelves = this.shelvesService.listAll();
      this.optionsFormModel = [
        new DynamicSelectModel<string>({
          id: 'shelf',
          label: 'Rayon',
          value: this.data.shelf._id,
          validators: { required: null },
          options: from(this.shelves.then(optionMap('_id', 'name')),
          ),
        }),
      ]
    }

    this.formGroup = this.formService.createFormGroup(this.optionsFormModel);
  }

  public onNgSubmit(): void {
    if(this.formGroup.valid){
      let res = {};
      if(this.data.providers){
        res = {
          ...res,
          provider: this.formGroup.get('provider').value,
        };
      }
      if(this.data.shelves){
        res = {
          ...res,
          shelf: this.formGroup.get('shelf').value,
          stopDialog: this.stopDialog
        };
      }
      if(this.data.types){
        res = {
          ...res,
          type: this.formGroup.get('type').value,
        };
      }
      this.dialogRef.close(res);
    }
  }
}
