import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KommissionsRoutingModule } from './kommissions-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    KommissionsRoutingModule,
  ],
})
export class KommissionsModule { }
