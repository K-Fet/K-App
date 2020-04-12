import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekViewerComponent } from './week-viewer/week-viewer.component';
import { SharedModule } from '../../shared/shared.module';
import { WeekViewerDayComponent } from './week-viewer-day/week-viewer-day.component';


@NgModule({
  declarations: [WeekViewerComponent, WeekViewerDayComponent],
  exports: [
    WeekViewerComponent,
    WeekViewerDayComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class ServiceWeekViewerModule {}
