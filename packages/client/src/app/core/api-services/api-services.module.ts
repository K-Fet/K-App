import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { KommissionService } from './kommission.service';
import { RoleService } from './role.service';
import { ServiceService } from './service.service';
import { TemplateService } from './template.service';
import { UsersService } from './users.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthService,
    KommissionService,
    RoleService,
    ServiceService,
    TemplateService,
    UsersService,
  ],
})
export class ApiServicesModule {}
