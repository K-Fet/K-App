import { NgModule } from '@angular/core';

import { MembersRoutingModule } from './members-routing.module';
import { MemberService } from './services/member.service';
import { SharedModule } from '../shared/shared.module';
import { MembersListComponent } from './list/members-list.component';
import { MemberNewEditComponent } from './new-edit/member-new-edit.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    MembersListComponent,
    MemberNewEditComponent,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    MembersRoutingModule,
  ],
  providers: [
    MemberService,
  ],
})
export class MembersModule {}
