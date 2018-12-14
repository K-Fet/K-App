import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { BarmanDetailResolverService } from './barman-detail-resolver.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditGuard } from '../core/guards/edit.guard';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['barman:write'] } },
  },
  {
    path: ':id',
    component: ViewComponent,
    resolve: {
      barman: BarmanDetailResolverService,
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [EditGuard],
    resolve: {
      barman: BarmanDetailResolverService,
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
export class BarmenRoutingModule {}
