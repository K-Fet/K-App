import { NgModule } from '@angular/core';
import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    SharedModule,
    InventoryManagementRoutingModule,
  ],
})
export class InventoryManagementModule {}
