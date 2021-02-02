import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InventoryAdjustmentRoutingModule } from './inventory-adjustment-routing.module';
import { AdjustmentComponent, ValidationDialog } from './adjustment/adjustment.component';
import { StockTableComponent } from './stock-table/stock-table.component';
import { ChooseProductDialogComponent } from './choose-product-dialog/choose-product-dialog.component';
import { InventoryAdjustmentComponent } from './inventory-adjustment.component';
import { StocksManagementComponent } from './stocks-management/stocks-management.component';
import { StocksManagementTableComponent } from './stocks-management-table/stocks-management-table.component';


@NgModule({
  declarations: [
    AdjustmentComponent,
    StockTableComponent,
    ValidationDialog,
    ChooseProductDialogComponent,
    InventoryAdjustmentComponent,
    StocksManagementComponent,
    StocksManagementTableComponent
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryAdjustmentRoutingModule,
  ],
  entryComponents: [
    ValidationDialog,
    ChooseProductDialogComponent,
  ]
})
export class InventoryAdjustmentModule { }
