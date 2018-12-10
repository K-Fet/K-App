import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-base-contact-form',
  templateUrl: './base-contact-form.component.html',
})
export class BaseContactFormComponent implements OnInit {

  @Input() title: string;
  @Input() model: DynamicFormModel;

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;

  token: string;
  siteKey: string = environment.RECAPTCHA_SITE_KEY;

  constructor(private formService: DynamicFormService) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  onCaptchaComplete(response: string): void {
    this.token = response;
  }

  onNgSubmit() {
    return this.onSubmit.emit({ token: this.token, value: this.formGroup.value });
  }
}
