import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MemberService } from '../../_services/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './member-new.component.html',
})

export class MemberNewComponent implements OnInit {
    firstName: string;
    lastName: string;
    school: string;

    lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
    firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
    schoolFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private memberService: MemberService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

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
