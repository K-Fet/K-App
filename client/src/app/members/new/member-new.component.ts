import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MemberService } from '../../_services/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { FormArray } from '@angular/forms/src/model';

@Component({
  templateUrl: './member-new.component.html',
})

export class MemberNewComponent implements OnInit {
    firstName: string;
    lastName: string;
    school: string;

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
            schoolFormControl: ['', Validators.required]
        });
        this.codeFormGroup = this.formBuilder.group({
            codeFormControl: ['', Validators.required]
        });
        this.formArray = this.formBuilder.array([
            this.memberFormGroup,
            this.codeFormGroup
        ]);
        this.form = this.formBuilder.group({
            formArray: this.formArray
        });
    }

    add() {
        const member = new Member();
        member.firstName = this.firstName;
        member.lastName = this.lastName;
        member.school = this.school;
        this.memberService.create(member).subscribe(() => {
            this.toasterService.showToaster('Adhérent créé', 'Fermer');
            this.router.navigate(['/members'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
