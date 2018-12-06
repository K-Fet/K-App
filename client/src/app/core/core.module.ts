import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiServicesModule } from './api-services/api-services.module';
import { ServicesModule } from './services/services.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiServicesModule,
    ServicesModule,
  ],
})
export class CoreModule {}
