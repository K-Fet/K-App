import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateSchool } from '../../_validators/school.validator';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { AVAILABLE_SCHOOLS } from '../../_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-school-dialog',
  templateUrl: './update-school.component.html',
})
export class UpdateSchoolDialogComponent {

  schoolForm: FormGroup;
  filteredSchools: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<UpdateSchoolDialogComponent>, private fb: FormBuilder) {
    this.schoolForm = this.fb.group({
      school: new FormControl('', [Validators.required, ValidateSchool]),
    });

    this.filteredSchools = this.schoolForm.controls.school.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSchool(value)),
      );
  }

  private filterSchool(value: string) {
    const school = value.toLowerCase();

    // Send all schools if one is selected (in case of wrong click)
    if (AVAILABLE_SCHOOLS.find(s => s.toLowerCase() === school)) return AVAILABLE_SCHOOLS;

    return AVAILABLE_SCHOOLS.filter(s => s.toLowerCase().includes(school));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
