import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService, ToasterService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Member, AVAILABLE_SCHOOLS } from '../../_models';
import { ValidateCheckbox } from '../../_validators/checkbox.validator';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { CURRENT_SCHOOL_YEAR } from '../../_helpers/currentYear';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './member-new-edit.component.html',
  styleUrls: ['./member-new-edit.component.scss'],
})

export class MemberNewEditComponent implements OnInit {
  memberId: number;
  reRegistration = false;
  registrationForm: FormGroup;
  availableSchools = AVAILABLE_SCHOOLS;
  searchedMembersData: MatTableDataSource<Member>;
  displayedColumns = ['lastName', 'firstName', 'school', 'lastActive'];
  searchQuery: string;
  spinner = false;
  notEnoughCharacters = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private memberService: MemberService,
    private toasterService: ToasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.initEdit();
    this.initNameValidation();
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
    this.registrationForm.controls.lastName.valueChanges.subscribe((value) => {
      this.registrationForm.controls.lastName.setValue(this.nameFormatter(value), { emitEvent: false });
    });
    this.registrationForm.controls.firstName.valueChanges.subscribe((value) => {
      this.registrationForm.controls.firstName.setValue(this.nameFormatter(value), { emitEvent: false });
    });
  }

  initEdit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.memberId = +params['id'];
        this.memberService.getById(+this.memberId).subscribe((member) => {
          this.registrationForm.controls.lastName.setValue(member.lastName);
          this.registrationForm.controls.firstName.setValue(member.firstName);
          this.registrationForm.controls.school.setValue(member.school);
        });
        this.registrationForm.controls.statuts.setValue(true);
        this.registrationForm.controls.ri.setValue(true);
      }
    });
  }

  nameFormatter(name: string): string {
    const newName = !name ? name :
      name.replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return newName;
  }

  search(): void {
    this.searchQuery = this.nameFormatter(this.searchQuery);
    this.notEnoughCharacters = this.searchQuery.length <= 3 ? true : false;
    if (!this.notEnoughCharacters) {
      this.spinner = true;
      this.memberService.search(this.searchQuery, false)
      .subscribe((members) => {
        this.searchedMembersData = new MatTableDataSource(members);
        this.searchedMembersData.paginator = this.paginator;
        this.searchedMembersData.sort = this.sort;
        this.spinner = false;
      },         (e) => {
        this.spinner = false;
        throw e;
      });
    } else {
      this.searchedMembersData = undefined;
    }
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
}
