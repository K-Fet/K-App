import { NgModule } from '@angular/core';
import { ReCaptchaModule } from 'angular2-recaptcha';

import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BaseContactFormComponent } from './base-contact-form/base-contact-form.component';
import { ContactService } from './services/contact.service';
import { ContactFormComponent } from './contact-form/contact-form.component';

@NgModule({
  declarations: [
    ContactFormComponent,
    BaseContactFormComponent,
  ],
  providers: [
    ContactService,
  ],
  imports: [
    SharedModule,
    ReCaptchaModule,
    ContactRoutingModule,
  ],
})
export class ContactModule {}
