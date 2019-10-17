import { NgModule } from '@angular/core';
import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryManagementRoutingModule,
  ],
})
export class InventoryManagementModule {}
