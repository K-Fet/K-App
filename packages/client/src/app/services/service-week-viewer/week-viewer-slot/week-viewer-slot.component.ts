import { Component, Input } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';

@Component({
  selector: 'app-week-viewer-slot',
  templateUrl: './week-viewer-slot.component.html',
  styleUrls: ['./week-viewer-slot.component.scss'],
})
export class WeekViewerSlotComponent {

  @Input()
  private controller: WeekViewerController;

  @Input()
  private item: WeekViewerItem;

  remove(): void {
    this.controller.removeItem(this.item);
  }
}
