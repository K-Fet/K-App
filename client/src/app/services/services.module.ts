import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    ServicesRoutingModule,
  ],
})
export class ServicesModule { }
