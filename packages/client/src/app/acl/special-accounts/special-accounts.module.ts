import { NgModule } from '@angular/core';

import { SpecialAccountsRoutingModule } from './special-accounts-routing.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionsSelectorModule } from '../permissions-selector/permissions-selector.module';
import { SpecialAccountService } from './special-account.service';
import { SpecialAccountDetailResolverService } from './special-account-detail-resolver.service';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
  ],
  providers: [
    SpecialAccountService,
    SpecialAccountDetailResolverService,
  ],
  imports: [
    PermissionsSelectorModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    SpecialAccountsRoutingModule,
  ],
})
export class SpecialAccountsModule {}
