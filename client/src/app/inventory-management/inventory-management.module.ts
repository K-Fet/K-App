import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { HelloWorldComponent } from './hello-world/hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    CommonModule,
    InventoryManagementRoutingModule,
  ],
})
export class InventoryManagementModule {}
