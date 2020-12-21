import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdjustmentComponent } from './inventory-adjustment/adjustment/adjustment.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InventoryAdjustmentRoutingModule } from './inventory-adjustment/inventory-adjustment-routing.module';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:invoice-tool'] } },
    children: [
      {
        path: 'adjustment',
        component: AdjustmentComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: ['inventory-management:invoice-tool'] } },
      },
    ]
  },
];

@NgModule({
  imports: 
  [
    RouterModule.forChild(routes), 
    InventoryAdjustmentRoutingModule
  ],
  exports: [RouterModule],
})
export class InventoryToolsRoutingModule {}
