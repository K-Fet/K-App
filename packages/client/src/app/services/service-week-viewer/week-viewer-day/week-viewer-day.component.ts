import { Component, Input, TemplateRef } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';
import { addHours, endOfHour, endOfMinute, setHours, setMinutes } from 'date-fns';

@Component({
  selector: 'app-week-viewer-day',
  templateUrl: './week-viewer-day.component.html',
  styleUrls: ['./week-viewer-day.component.scss'],
})
export class WeekViewerDayComponent {

  @Input()
  private weekViewerController: WeekViewerController;

  @Input()
  itemFormTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  @Input()
  newItemFormTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  @Input()
  dayDate: number; // Timestamp

  @Input()
  items: WeekViewerItem[];

  @Input()
  hideDelete: boolean;

  @Input()
  hideAdd: boolean;

  getContext(item: WeekViewerItem): { add: () => void; item: WeekViewerItem; controller: WeekViewerController } {
    return {
      item,
      controller: this.weekViewerController,
      add: () => this.onAdd(),
    };
  }

  onAdd(): void {
    const last = this.items[this.items.length - 1];
    const start = last
      ? endOfMinute(endOfHour(last.start))
      : setHours(setMinutes(this.dayDate, 0), 18);

    this.weekViewerController.createItem({
      key: Symbol(),
      start,
      end: addHours(start, 2),
    });
  }

  onRemove(item: WeekViewerItem): void {
    this.weekViewerController.removeItem(item);
  }
}
