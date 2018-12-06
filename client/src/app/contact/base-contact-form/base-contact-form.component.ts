import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-contact-form',
  templateUrl: './base-contact-form.component.html',
  styleUrls: ['./base-contact-form.component.scss'],
})
export class BaseContactFormComponent implements OnInit {

  @Input() title: string;
  @Input() model: DynamicFormModel;

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;

  constructor(private formService: DynamicFormService) { }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.model);
  }

  onNgSubmit(event) {
    return this.submit.emit(event);
  }
}
