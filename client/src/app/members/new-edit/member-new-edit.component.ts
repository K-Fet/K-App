import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService, ToasterService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Member, AVAILABLE_SCHOOLS } from '../../_models';
import { FormArray } from '@angular/forms/src/model';
import { ValidateCheckbox } from '../../_validators/checkbox.validator';

@Component({
  templateUrl: './member-new-edit.component.html',
})

export class MemberNewEditComponent implements OnInit {
  memberId: number;

  formArray: FormArray;
  memberFormGroup: FormGroup;
  barmanFormGroup: FormGroup;
  form: FormGroup;

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
    });
    this.barmanFormGroup = this.formBuilder.group({
      statut: [true, ValidateCheckbox],
      ri: [true, ValidateCheckbox],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]],
    });
    this.formArray = this.formBuilder.array([
      this.memberFormGroup,
      this.barmanFormGroup,
    ]);
    this.form = this.formBuilder.group({
      formArray: this.formArray,
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
  }

  nameFormatter(name: string): string {
    const newName = !name ? name :
      name.replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return newName;
  }

  submitForm(): void {
    const member = new Member(...this.memberFormGroup.value);
    const code = this.barmanFormGroup.controls.code.value;
    if (this.memberId) {
      member.id = this.memberId;
      this.memberService.update(member, code).subscribe(() => {
        this.toasterService.showToaster('Utilisateur modifié');
        this.router.navigate(['/members']);
      });
    } else {
      this.memberService.create(member, code).subscribe(() => {
        this.toasterService.showToaster('Adhérent créé');
        this.router.navigate(['/members']);
      });
    }
  }
}
