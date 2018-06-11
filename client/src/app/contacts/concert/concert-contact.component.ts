import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService, ToasterService } from '../../_services';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './concert-contact.component.html',
})

export class ConcertContactComponent {

  contactForm: FormGroup;
  token: String;
  siteKey: String = environment.RECAPTACHA_SITE_KEY;

  constructor(private fb: FormBuilder,
              private contactService: ContactService,
              private toasterService: ToasterService,
              private router: Router) {
    this.createForm();
  }

  createForm(): void {
    this.contactForm = this.fb.group({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^((\+)33|0)[1-9](\d{2}){4}$/)]),
      stageName: new FormControl('', [Validators.required]),
      musicStyle: new FormControl('', [Validators.required]),
      whereListen: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  onCaptchaComplete(response: String): void {
    this.token = response;
  }

  send(): void {
    this.contactService.send('concert', this.contactForm.value, this.token).subscribe(() => {
      this.toasterService.showToaster('Votre demande a bien été enregistrée. Nous y donnerons suite dès que possible!');
      this.router.navigate(['/']);
    });
  }
}
