import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { FeedComponent } from './feed/feed.component';
import { HomeRoutingModule } from './home-routing.module';
import { PresentationComponent } from './presentation/presentation.component';
import { TasksModule } from '../kommissions/tasks/tasks.module';
import { MyServicesModule } from '../services/my-services/my-services.module';

@NgModule({
  declarations: [
    HomePageComponent,
    FeedComponent,
    PresentationComponent,
  ],
  imports: [
    SharedModule,
    TasksModule,
    MyServicesModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
