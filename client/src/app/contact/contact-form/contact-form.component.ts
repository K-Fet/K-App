import { Component } from '@angular/core';
import { DynamicFormModel } from '@ng-dynamic-forms/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-form',
  template: `
    <app-base-contact-form
      title="Contact (WIP)"
      [model]="formModel"
      (submit)="submit($event)"
    ></app-base-contact-form>
  `,
})
export class ContactFormComponent {

  formModel: DynamicFormModel = [];

  constructor(private contactService: ContactService) {}

  submit(event) {
    // TODO Send
    this.contactService.send('TODO', event, 'TODO');
  }
}
