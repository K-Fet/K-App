import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter, Inject,
  Input, Optional,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DynamicDatePickerModel,
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { OwlDateTimeComponent } from 'ng-pick-datetime';
import { LabelOptions, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';

@Component({
  selector: 'app-dynamic-owl-date-time',
  templateUrl: './dynamic-owl-date-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicOwlDateTimeComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicDatePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(OwlDateTimeComponent, { static: true }) owlDateTimeComponent: OwlDateTimeComponent<Date>;

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    @Inject(MAT_LABEL_GLOBAL_OPTIONS) @Optional() public LABEL_OPTIONS: LabelOptions,
  ) {

    super(layoutService, validationService);
  }
}
