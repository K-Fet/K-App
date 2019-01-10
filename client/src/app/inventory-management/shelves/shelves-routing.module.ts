import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelvesDetailResolverService } from './shelves-detail-resolver.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:shelves:create'] } },
  },
  {
    path: ':id',
    component: ViewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:shelves:get'] } },
    resolve: {
      shelf: ShelvesDetailResolverService,
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:shelves:update'] } },
    resolve: {
      shelf: ShelvesDetailResolverService,
    },
  },
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: [
          'inventory-management:shelves:find',
          'inventory-management:shelves:list',
        ],
      },
    },
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelvesRoutingModule {}
