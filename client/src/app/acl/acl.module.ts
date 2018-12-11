import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclRoutingModule } from './acl-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    AclRoutingModule,
  ],
})
export class AclModule { }
