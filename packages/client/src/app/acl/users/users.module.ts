import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionsSelectorModule } from '../permissions-selector/permissions-selector.module';
import { UserDetailResolverService } from './user-detail-resolver.service';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
  ],
  providers: [
    UserDetailResolverService,
  ],
  imports: [
    PermissionsSelectorModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    UsersRoutingModule,
  ],
})
export class UsersModule {}
