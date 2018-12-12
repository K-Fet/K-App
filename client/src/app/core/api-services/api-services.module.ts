import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { BarmanService } from './barman.service';
import { KommissionService } from './kommission.service';
import { MeService } from './me.service';
import { PermissionService } from './permission.service';
import { RoleService } from './role.service';
import { ServiceService } from './service.service';
import { TemplateService } from './template.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthService,
    BarmanService,
    KommissionService,
    MeService,
    PermissionService,
    RoleService,
    ServiceService,
    TemplateService,
  ],
})
export class ApiServicesModule {}
