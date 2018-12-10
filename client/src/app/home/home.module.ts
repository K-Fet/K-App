import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { FeedComponent } from './feed/feed.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomePageComponent,
    FeedComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
