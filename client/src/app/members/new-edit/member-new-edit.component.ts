import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService, ToasterService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Member, AVAILABLE_SCHOOLS } from '../../_models';
import { ValidateCheckbox } from '../../_validators/checkbox.validator';

@Component({
  templateUrl: './member-new-edit.component.html',
})

export class MemberNewEditComponent implements OnInit {
  memberId: number;
  reRegistration = false;
  registrationForm: FormGroup;
  availableSchools = AVAILABLE_SCHOOLS;
  searchedMembers: Member[] = [];
  searchQuery: string;
  spinner = false;
  notEnoughCharacters = false;

  constructor(
    private memberService: MemberService,
    private toasterService: ToasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

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
      this.memberService.search(this.searchQuery)
      .subscribe((members) => {
        this.searchedMembers = members;
        this.spinner = false;
      },         (e) => {
        this.spinner = false;
        throw e;
      });
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
}
