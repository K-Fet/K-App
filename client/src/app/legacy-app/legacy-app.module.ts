import { NgModule } from '@angular/core';
import { LegacyAppRoutingModule } from './legacy-app-routing.module';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    SharedModule,
    LegacyAppRoutingModule,
  ],
})
export class LegacyAppModule {}
