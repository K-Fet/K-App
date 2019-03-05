import { NgModule } from '@angular/core';

import { MembersRoutingModule } from './members-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MembersService } from './members.service';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    MembersRoutingModule,
  ],
  providers: [
    MembersService,
  ],
})
export class MembersModule {}
