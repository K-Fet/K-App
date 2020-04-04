import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekViewerSlotComponent } from './week-viewer-slot/week-viewer-slot.component';
import { WeekViewerComponent } from './week-viewer/week-viewer.component';


@NgModule({
  declarations: [WeekViewerSlotComponent, WeekViewerComponent],
  exports: [
    WeekViewerComponent,
    WeekViewerSlotComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class ServiceWeekViewerModule { }
