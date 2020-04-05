import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekViewerSlotComponent } from './week-viewer-slot/week-viewer-slot.component';
import { WeekViewerComponent } from './week-viewer/week-viewer.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [WeekViewerSlotComponent, WeekViewerComponent],
  exports: [
    WeekViewerComponent,
    WeekViewerSlotComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class ServiceWeekViewerModule {}
