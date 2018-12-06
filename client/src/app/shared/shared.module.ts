import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EqualValidator } from './directives/equal-validator.directive';

@NgModule({
  declarations: [
    EqualValidator,
  ],
  exports: [
    CommonModule,
    EqualValidator,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    // TODO Use material date picker
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
})
export class SharedModule {}
