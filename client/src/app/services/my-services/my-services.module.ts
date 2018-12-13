import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MyServicesComponent } from './my-services.component';

@NgModule({
  declarations: [
    MyServicesComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MyServicesComponent,
  ],
})
export class MyServicesModule {}
