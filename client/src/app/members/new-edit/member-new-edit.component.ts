import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { debounceTime, filter, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ToasterService } from '../../core/services/toaster.service';
import { MemberService } from '../services/member.service';
import { Member } from '../models/Member';
import { ValidateSchool } from '../../shared/validators/school.validator';
import { ValidateCheckbox } from '../../shared/validators/checkbox.validator';
import { AVAILABLE_SCHOOLS, CURRENT_SCHOOL_YEAR } from '../../constants';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { UpdateSchoolDialogComponent } from '../../shared/dialogs/update-school/update-school.component';

@Component({
  templateUrl: './member-new-edit.component.html',
  styleUrls: ['./member-new-edit.component.scss'],
})

export class MemberNewEditComponent implements OnInit {
  memberId: number;
  registrationForm: FormGroup;
  isLoading = false;
  reRegistration = false;

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
    this.initForms();
    this.initNameFormatter();
    this.initEdit();
  }

  private initForms() {
    this.registrationForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      school: ['', [Validators.required, ValidateSchool]],
      statuts: [false, ValidateCheckbox],
      ri: [false, ValidateCheckbox],
    });

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

  private initNameFormatter(): void {
    const { lastName, firstName } = this.registrationForm.controls;

    const nameFormatter = (name: string = ''): string =>
      name
        .replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
        .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    lastName.valueChanges.subscribe((value) => {
      return lastName.setValue(nameFormatter(value), { emitEvent: false });
    });
    firstName.valueChanges.subscribe((value) => {
      return firstName.setValue(nameFormatter(value), { emitEvent: false });
    });
  }

  private initEdit(): void {
    const { lastName, firstName, school, statuts, ri } = this.registrationForm.controls;

    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(id => !!id),
      tap(id => this.memberId = +id),
      switchMap(() => this.memberService.getById(this.memberId)),
      tap((member) => {
        lastName.setValue(member.lastName, { emitEvent: false });
        firstName.setValue(member.firstName, { emitEvent: false });
        school.setValue(member.school, { emitEvent: false });
        statuts.setValue(true);
        ri.setValue(true);
      }),
    ).subscribe();
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
    if (!ValidateSchool({ value: member.school })) {
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
    } else {
      const dialogRef = this.dialog.open(UpdateSchoolDialogComponent, {
        width: '350px',
        data: {
          member,
        },
      });

      dialogRef.afterClosed().subscribe((school) => {
        if (school) {
          const updatedMember = new Member({ school, id: member.id });
          forkJoin([this.memberService.update(updatedMember),
            this.memberService.register(member.id)])
            .subscribe(() => {
              this.toasterService.showToaster('Adhérent mis à jour et ré-inscrit.');
              this.router.navigate(['/members']);
            });
        }
      });
    }
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
