import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../_services/member.service';
import { Router } from '@angular/router';
import { Member } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { FormArray } from '@angular/forms/src/model';
import { ValidateCheckbox } from '../../_validators/checkbox.validator';

@Component({
  templateUrl: './member-new.component.html'
})

export class MemberNewComponent implements OnInit {
    firstName: string;
    lastName: string;
    school: string;
    statut: boolean;
    code: Number;

    formArray: FormArray;
    memberFormGroup: FormGroup;
    codeFormGroup: FormGroup;
    form: FormGroup;

    constructor(
        private memberService: MemberService,
        private toasterService: ToasterService,
        private router: Router,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.memberFormGroup = this.formBuilder.group({
            lastNameFormControl: ['', Validators.required],
            firstNameFormControl: ['', Validators.required],
            schoolFormControl: ['', Validators.required],
            statutFormControl: ['', ValidateCheckbox]
        });
        this.codeFormGroup = this.formBuilder.group({
            codeFormControl: ['', [ Validators.required, Validators.pattern(/^[0-9]{4,}$/) ]]
        });
        this.formArray = this.formBuilder.array([
            this.memberFormGroup,
            this.codeFormGroup
        ]);
        this.form = this.formBuilder.group({
            formArray: this.formArray
        });
    }

    add(): void {
        const member = new Member();
        member.firstName = this.firstName;
        member.lastName = this.lastName;
        member.school = this.school;
        this.memberService.create(member, this.code)
        .subscribe(() => {
            this.toasterService.showToaster('Adhérent créé');
            this.router.navigate(['/members'] );
        });
    }
}
