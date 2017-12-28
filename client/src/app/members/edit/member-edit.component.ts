import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MemberService } from '../../_services/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';

@Component({
  templateUrl: './member-edit.component.html',
})

export class MemberEditComponent implements OnInit {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    school: string;

    emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    schoolFormControl: FormControl = new FormControl('', [Validators.required]);

    private sub: any;

    constructor(
        private memberService: MemberService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.memberService.getById(+this.id).subscribe(member => {
                this.firstName = member.firstName;
                this.lastName = member.lastName;
                this.school = member.school;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const member = new Member();
        member.id = +this.id;
        member.firstName = this.firstName;
        member.lastName = this.lastName;
        member.school = this.school;
        this.memberService.update(member).subscribe(() => {
            this.toasterService.showToaster('Utilisateur modifié', 'Fermer');
            this.router.navigate(['/members']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
