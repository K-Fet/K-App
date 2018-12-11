import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarmenRoutingModule } from './barmen-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    BarmenRoutingModule,
  ],
})
export class BarmenModule { }
