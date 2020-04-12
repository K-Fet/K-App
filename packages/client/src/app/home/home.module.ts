import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MyServicesModule } from '../services/my-services/my-services.module';

@NgModule({
  declarations: [
    HomePageComponent,
  ],
  imports: [
    SharedModule,
    MyServicesModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
