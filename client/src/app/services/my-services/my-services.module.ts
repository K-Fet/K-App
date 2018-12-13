import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MyServicesComponent } from './my-services.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MyServicesComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
  ],
  exports: [
    MyServicesComponent,
  ],
})
export class MyServicesModule {}
