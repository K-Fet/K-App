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
      permissions: { only: ['members.read'] },
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
    data: { permissions: { only: ['members.update', 'members.create'] } },
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
