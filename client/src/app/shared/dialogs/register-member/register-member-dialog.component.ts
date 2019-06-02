import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ValidateSchool } from '../../validators/school.validator';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { AVAILABLE_SCHOOLS, CURRENT_SCHOOL_YEAR } from '../../../constants';
import { Observable } from 'rxjs';
import { Member } from '../../../members/member.model';

@Component({
  templateUrl: './register-member-dialog.component.html',
})
export class RegisterMemberDialogComponent {

  currentSchoolYear = CURRENT_SCHOOL_YEAR;
  schoolControl: FormControl;
  filteredSchools: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<RegisterMemberDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public member: Member) {
    this.schoolControl = new FormControl(member.school, [ValidateSchool]);

    this.filteredSchools = this.schoolControl.valueChanges.pipe(
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
}
