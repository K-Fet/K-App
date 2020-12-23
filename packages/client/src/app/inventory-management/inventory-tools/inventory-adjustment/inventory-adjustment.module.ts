import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InventoryAdjustmentRoutingModule } from './inventory-adjustment-routing.module';
import { AdjustmentComponent, ValidationDialog } from './adjustment/adjustment.component';
import { StockTableComponent } from './stock-table/stock-table.component';


@NgModule({
  declarations: [
    AdjustmentComponent, 
    StockTableComponent,
    ValidationDialog
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryAdjustmentRoutingModule,
  ],
  entryComponents: [
    ValidationDialog
  ]
})
export class InventoryAdjustmentModule { }
