import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { FeedComponent } from './feed/feed.component';
import { HomeRoutingModule } from './home-routing.module';
import { PresentationComponent } from './presentation/presentation.component';
import { TasksModule } from '../kommissions/tasks/tasks.module';

@NgModule({
  declarations: [
    HomePageComponent,
    FeedComponent,
    PresentationComponent,
  ],
  imports: [
    SharedModule,
    TasksModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
