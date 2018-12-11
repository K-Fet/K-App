import { NgModule } from '@angular/core';
import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InventoryManagementRoutingModule,
  ],
})
export class InventoryManagementModule {}
