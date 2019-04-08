import { NgModule } from '@angular/core';

import { MembersRoutingModule } from './members-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MembersService } from './members.service';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { MemberDetailResolverService } from './member-detail-resolver.service';

@NgModule({
  declarations: [
    ListComponent,
    NewComponent,
    EditComponent,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    MembersRoutingModule,
  ],
  providers: [
    MemberDetailResolverService,
    MembersService,
  ],
})
export class MembersModule {}
