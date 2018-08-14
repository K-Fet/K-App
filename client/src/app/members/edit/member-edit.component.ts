import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService, ToasterService } from '../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models';

@Component({
  templateUrl: './member-edit.component.html',
})

export class MemberEditComponent implements OnInit {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  code: number;

  formArray: FormArray;
  memberFormGroup: FormGroup;
  codeFormGroup: FormGroup;
  form: FormGroup;

  constructor(
    private memberService: MemberService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.memberService.getById(+this.id).subscribe((member) => {
        this.firstName = member.firstName;
        this.lastName = member.lastName;
        this.school = member.school;
      });
    });
    this.memberFormGroup = this.formBuilder.group({
      lastNameFormControl: ['', Validators.required],
      firstNameFormControl: ['', Validators.required],
      schoolFormControl: ['', Validators.required],
    });
    this.codeFormGroup = this.formBuilder.group({
      codeFormControl: ['', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]],
    });
    this.formArray = this.formBuilder.array([
      this.memberFormGroup,
      this.codeFormGroup,
    ]);
    this.form = this.formBuilder.group({
      formArray: this.formArray,
    });
  }

  edit(): void {
    const member = new Member();
    member.id = +this.id;
    member.firstName = this.firstName;
    member.lastName = this.lastName;
    member.school = this.school;
    this.memberService.update(member, this.code).subscribe(() => {
      this.toasterService.showToaster('Utilisateur modifié');
      this.router.navigate(['/members']);
    });
  }
}
