import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { StockEventsRoutingModule } from './stock-events-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { InventoryManagementApiServicesModule } from '../api-services/inventory-management-api-services.module';
import { ListEventService } from './services/list-event.service';



@NgModule({
  declarations: [
    NewComponent,
    ListComponent,
  ],
  imports: [
    SharedModule,
    InventoryManagementApiServicesModule,
    NgxPermissionsModule.forChild(),
    StockEventsRoutingModule,
  ],
  providers: [
    ListEventService,
  ],
})
export class StockEventsModule {}
