import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelloWorldComponent } from './hello-world/hello-world.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'providers',
    loadChildren: './providers/providers.module#ProvidersModule',
    data: {
      permissions: {
        only: [
          'inventory-management:providers:find',
          'inventory-management:providers:list',
          'inventory-management:providers:get',
        ],
      },
    },
    canLoad: [NgxPermissionsGuard],
  },
  {
    path: '',
    component: HelloWorldComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryManagementRoutingModule {}
