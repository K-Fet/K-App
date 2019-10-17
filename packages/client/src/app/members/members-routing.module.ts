import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { MemberDetailResolverService } from './member-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: [
          'v1:core:members:find',
          'v1:core:members:list',
        ],
      },
    },
  },
  {
    path: 'newmember',
    component: NewComponent,
    outlet: 'modal',
  },
  {
    path: ':id/edit',
    component: EditComponent,
    outlet: 'modal',
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['v1:core:members:update'] } },
    resolve: {
      member: MemberDetailResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
