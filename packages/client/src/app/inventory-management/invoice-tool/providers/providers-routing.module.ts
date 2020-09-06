import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderDetailResolverService } from '../../api-services/provider-detail-resolver.service';
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
    data: { permissions: { only: ['inventory-management:providers:create'] } },
  },
  {
    path: ':id',
    component: ViewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:providers:get'] } },
    resolve: {
      provider: ProviderDetailResolverService,
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:providers:update'] } },
    resolve: {
      provider: ProviderDetailResolverService,
    },
  },
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: [
          'inventory-management:providers:find',
          'inventory-management:providers:list',
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
export class ProvidersRoutingModule {}
