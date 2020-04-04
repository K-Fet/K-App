import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { KommissionsService } from './kommissions.service';
import { RolesService } from './roles.service';
import { ServicesService } from './services.service';
import { ServicesTemplatesService } from './services-templates.service';
import { UsersService } from './users.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthService,
    KommissionsService,
    RolesService,
    ServicesService,
    ServicesTemplatesService,
    UsersService,
  ],
})
export class ApiServicesModule {}
