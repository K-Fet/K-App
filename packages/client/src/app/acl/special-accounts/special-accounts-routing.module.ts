import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { SpecialAccountDetailResolverService } from './special-account-detail-resolver.service';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditGuard } from '../../core/guards/edit.guard';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['specialaccount:write'] } },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    // FIXME A special can only update itslef if it has specialaccount:read perm
    canActivate: [EditGuard],
    resolve: {
      specialAccount: SpecialAccountDetailResolverService,
    },
  },
  {
    path: '',
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialAccountsRoutingModule {}
