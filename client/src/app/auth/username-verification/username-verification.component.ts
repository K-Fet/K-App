import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, ToasterService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-username-verification',
  templateUrl: './username-verification.component.html',
})

export class UsernameVerificationComponent implements OnInit {

    passwordForm: FormGroup;
    token: String;
    username: String;
    userId: Number;

    constructor (private authService: AuthService,
        private toasterService: ToasterService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
        this.createForm();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['username'] && params['usernameToken'] && params['userId']) {
                this.username = params['username'];
                this.token = params['usernameToken'];
                this.userId = params['userId'];
            } else {
                this.toasterService.showToaster('Problème dans la récupération du username ou du token');
                setTimeout(this.router.navigate(['/login']), 1000);
            }
        });
    }

    createForm() {
        this.passwordForm = this.fb.group({
            password: new FormControl('', [Validators.required]),
        });
    }

    verifyUsername() {
        const password = this.passwordForm.get('password').value;
        this.authService.verifyUsername(this.userId, this.username, password, this.token).subscribe(() => {
            this.toasterService.showToaster('Enregistré, veuillez vous connecter');
            setTimeout(this.router.navigate(['/login']), 1000);
        });
    }
}
