import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InventoryAdjustmentRoutingModule } from './inventory-adjustment-routing.module';
import { AdjustmentComponent } from './adjustment/adjustment.component';


@NgModule({
  declarations: [AdjustmentComponent],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryAdjustmentRoutingModule,
  ]
})
export class InventoryAdjustmentModule { }
