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

  memberFormGroup: FormGroup;

  availableSchools = AVAILABLE_SCHOOLS;

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
    this.memberFormGroup = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      school: ['', Validators.required],
      statuts: [false, ValidateCheckbox],
      ri: [false, ValidateCheckbox],
    });
  }

  initNameValidation(): void {
    this.memberFormGroup.controls.lastName.valueChanges.subscribe((value) => {
      this.memberFormGroup.controls.lastName.setValue(this.nameFormatter(value), { emitEvent: false });
    });
    this.memberFormGroup.controls.firstName.valueChanges.subscribe((value) => {
      this.memberFormGroup.controls.firstName.setValue(this.nameFormatter(value), { emitEvent: false });
    });
  }

  initEdit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.memberId = +params['id'];
        this.memberService.getById(+this.memberId).subscribe((member) => {
          this.memberFormGroup.controls.lastName.setValue(member.lastName);
          this.memberFormGroup.controls.firstName.setValue(member.firstName);
          this.memberFormGroup.controls.school.setValue(member.school);
        });
      }
    });
    this.memberFormGroup.controls.statuts.setValue(true);
    this.memberFormGroup.controls.ri.setValue(true);
  }

  nameFormatter(name: string): string {
    const newName = !name ? name :
      name.replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return newName;
  }

  submitForm(): void {
    const member = new Member({
      lastName: this.memberFormGroup.get('lastName').value,
      firstName: this.memberFormGroup.get('firstName').value,
      school: this.memberFormGroup.get('school').value,
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
