import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';
import {
  eachDayOfInterval,
  endOfWeek,
  getTime,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { DEFAULT_WEEK_SWITCH } from '../../../constants';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-week-viewer',
  templateUrl: './week-viewer.component.html',
  styleUrls: ['./week-viewer.component.scss'],
})
export class WeekViewerComponent implements OnInit {
  @Input()
  private weekViewerController: WeekViewerController;

  @Input()
  slotTemplate: TemplateRef<any>;

  range: Map<number, WeekViewerItem[]>;

  ngOnInit(): void {
    this.weekViewerController.items$.subscribe((items) => {
      const [first] = items;
      const interval = {
        start: startOfWeek(first.start, { weekStartsOn: DEFAULT_WEEK_SWITCH }),
        end: endOfWeek(first.start, { weekStartsOn: DEFAULT_WEEK_SWITCH }),
      };

      this.range = new Map(eachDayOfInterval(interval).map(date => [getTime(startOfDay(date)), []]));

      items
        .filter(item => isWithinInterval(item.start, interval))
        .forEach(item => this.range.get(getTime(startOfDay(item.start))).push(item));
      console.log(this.range);
    });
  }

  byKeyOrder(a: KeyValue<number, WeekViewerItem[]>, b: KeyValue<number, WeekViewerItem[]>): number {
    return a.key - b.key;
  }

  getContext(item: WeekViewerItem): { item: WeekViewerItem; controller: WeekViewerController } {
    return {
      item,
      controller: this.weekViewerController,
    };
  }

  onAdd(timestamp: number): void {
    // TODO Find start date and end date
    this.weekViewerController.createItem({
      key: Symbol(),
      start: setMinutes(setHours(timestamp, 18), 0),
      end: new Date(),
    });
  }
}
