import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { AVAILABLE_SCHOOLS, Member } from '../../_models';
import { ValidateCheckbox } from '../../_validators/checkbox.validator';
import { MatDialog } from '@angular/material';
import { CURRENT_SCHOOL_YEAR } from '../../_helpers/currentYear';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { debounceTime, filter, finalize, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './member-new-edit.component.html',
  styleUrls: ['./member-new-edit.component.scss'],
})

export class MemberNewEditComponent implements OnInit {
  memberId: number;
  registrationForm: FormGroup;
  isLoading = false;

  filteredSchools: Observable<string[]>;

  searchQuery = new FormControl();
  filteredMembers: Observable<Member[]>;

  constructor(
    private memberService: MemberService,
    private toasterService: ToasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.initEdit();
    this.initNameValidation();

    this.filteredSchools = this.registrationForm.controls.school.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSchool(value)),
      );

    this.filteredMembers = this.searchQuery.valueChanges
      .pipe(
        filter(value => value.length >= 3),
        debounceTime(300),
        // FIXME isLoading does not work for now, getting a 'ExpressionChangedAfterItHasBeenCheckedError'
        // tap(() => this.isLoading = true),
        // input is a string at first but become a object when a member is selected
        map(value => typeof value === 'string' ? value : `${value.firstName} ${value.lastName}`),
        switchMap(value => this.searchMembers(value)
          .pipe(finalize(() => this.isLoading = false))),
      );
  }

  initForm(): void {
    this.registrationForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      school: ['', Validators.required],
      statuts: [false, ValidateCheckbox],
      ri: [false, ValidateCheckbox],
    });
  }

  initNameValidation(): void {
    const { lastName, firstName } = this.registrationForm.controls;

    lastName.valueChanges.subscribe(value => lastName.setValue(this.nameFormatter(value)));
    firstName.valueChanges.subscribe(value => firstName.setValue(this.nameFormatter(value)));
  }

  async initEdit(): Promise<void> {
    const { id } = await this.route.params.toPromise();

    if (!id) return;

    const { lastName, firstName, school, statuts, ri } = this.registrationForm.controls;
    this.memberId = +id;
    this.memberService.getById(+this.memberId).subscribe((member) => {
      lastName.setValue(member.lastName);
      firstName.setValue(member.firstName);
      school.setValue(member.school);
      statuts.setValue(true);
      ri.setValue(true);
    });
  }

  nameFormatter(name: string): string {
    if (!name) return '';
    return name
      .replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  }

  submitRegistrationForm(): void {
    const member = new Member({
      lastName: this.registrationForm.get('lastName').value,
      firstName: this.registrationForm.get('firstName').value,
      school: this.registrationForm.get('school').value,
    });
    if (this.memberId) {
      member.id = this.memberId;
      this.memberService.update(member).subscribe(() => {
        this.toasterService.showToaster('Utilisateur modifié');
        this.router.navigate(['/members']);
      });
    } else {
      this.memberService.create(member).subscribe(() => {
        this.toasterService.showToaster('Adhérent créé');
        this.router.navigate(['/members']);
      });
    }
  }

  getLastActive(member: Member): string {
    if (member.registrations && member.registrations.length > 0) {
      // Ordered from the last registration to the oldest
      const { year } = member.registrations[0];

      if (year === CURRENT_SCHOOL_YEAR) {
        return 'Actif';
      }
      return `Inactif depuis ${year}-${year + 1}`;
    }
    return 'Aucune activité';
  }

  openRegisterDialog(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Inscription de ${member.firstName} ${member.lastName} ` +
          `pour l'année ${CURRENT_SCHOOL_YEAR}-${CURRENT_SCHOOL_YEAR + 1} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.register(member);
    });
  }

  register(member: Member) {
    this.memberService.register(member.id).subscribe(({ year }) => {
      this.toasterService.showToaster(`Adhérent inscrit pour l'année ${year}-${year + 1}`);
      this.router.navigate(['/members']);
    });
  }

  private filterSchool(value: string) {
    const school = value.toLowerCase();

    // Send all schools if one is selected (in case of wrong click)
    if (AVAILABLE_SCHOOLS.find(s => s.toLowerCase() === school)) return AVAILABLE_SCHOOLS;

    return AVAILABLE_SCHOOLS.filter(s => s.toLowerCase().includes(school));
  }

  private searchMembers(value: string) {
    return this.memberService.search(value, false);
  }

  displayMember(member: Member) {
    if (member) {
      return `${member.firstName} ${member.lastName} — ${member.school}`;
    }
  }
}
