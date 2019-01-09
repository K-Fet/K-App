import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { InventoryManagementApiServicesModule } from '../api-services/inventory-management-api-services.module';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  imports: [
    SharedModule,
    InventoryManagementApiServicesModule,
    NgxPermissionsModule.forChild(),
    ProductsRoutingModule,
  ],
})
export class ProductsModule {}
