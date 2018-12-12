import { NgModule } from '@angular/core';

import { RolesRoutingModule } from './roles-routing.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PermissionsSelectorModule } from '../permissions-selector/permissions-selector.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
  ],
  imports: [
    PermissionsSelectorModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    RolesRoutingModule,
  ],
})
export class RolesModule {}
