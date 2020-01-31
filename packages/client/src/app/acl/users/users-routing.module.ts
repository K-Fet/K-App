import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { UserDetailResolverService } from './user-detail-resolver.service';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['users.read'] } },
  },
  {
    path: 'newuser',
    component: NewComponent,
    outlet: 'modal',
  },
  {
    path: ':id/edit',
    component: EditComponent,
    outlet: 'modal',
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['users.write', 'users.create'] } },
    resolve: {
      user: UserDetailResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
