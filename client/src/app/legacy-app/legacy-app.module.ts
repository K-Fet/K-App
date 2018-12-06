import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegacyAppRoutingModule } from './legacy-app-routing.module';
import { HelloWorldComponent } from './hello-world/hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    CommonModule,
    LegacyAppRoutingModule,
  ],
})
export class LegacyAppModule {}
