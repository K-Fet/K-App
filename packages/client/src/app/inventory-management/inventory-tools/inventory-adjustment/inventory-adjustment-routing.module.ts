import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { InventoryAdjustmentComponent } from './inventory-adjustment.component';

const routes: Routes = [
  {
    path: 'adjustment',
    component: InventoryAdjustmentComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:invoice-tool'] } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryAdjustmentRoutingModule {}
