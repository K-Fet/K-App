import { NgModule } from '@angular/core';

import { ServicesRoutingModule } from './services-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../shared/shared.module';
import { BarmanServiceNumberComponent } from './barman-service-number/barman-service-number.component';
import { ServiceEditComponent } from './edit/service-edit.component';
import { ServiceListComponent } from './list/services-list.component';
import { ServiceNewComponent } from './new/service-new.component';
import { OpenServicesComponent } from './open-services/open-services.component';
import { PlanMyServicesComponent } from './plan-my-services/plan-my-services.component';
import { PlanningComponent } from './planning/planning.component';
import { ServiceExplorerComponent } from './services-explorer/services-explorer.component';
import { WeekPickerComponent } from './week-picker/week-picker.component';
import { MyServicesModule } from './my-services/my-services.module';

@NgModule({
  declarations: [
    BarmanServiceNumberComponent,
    ServiceEditComponent,
    ServiceListComponent,
    ServiceNewComponent,
    OpenServicesComponent,
    PlanMyServicesComponent,
    PlanningComponent,
    ServiceExplorerComponent,
    WeekPickerComponent,
  ],
  imports: [
    SharedModule,
    MyServicesModule,
    NgxPermissionsModule.forChild(),
    ServicesRoutingModule,
  ],
})
export class ServicesModule {}
