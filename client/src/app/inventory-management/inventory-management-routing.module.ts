import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    path: 'shelves',
    loadChildren: './shelves/shelves.module#ShelvesModule',
    data: {
      permissions: {
        only: [
          'inventory-management:shelves:find',
          'inventory-management:shelves:list',
          'inventory-management:shelves:get',
        ],
      },
    },
    canLoad: [NgxPermissionsGuard],
  },
  {
    path: 'products',
    loadChildren: './products/products.module#ProductsModule',
    data: {
      permissions: {
        only: [
          'inventory-management:products:find',
          'inventory-management:products:list',
          'inventory-management:products:get',
        ],
      },
    },
    canLoad: [NgxPermissionsGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryManagementRoutingModule {}
