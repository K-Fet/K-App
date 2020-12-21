import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdjustmentComponent } from './adjustment/adjustment.component';

const routes: Routes = [
  {
    path: 'adjustment',
    component: AdjustmentComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: ['inventory-management:invoice-tool'] } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryAdjustmentRoutingModule {}
