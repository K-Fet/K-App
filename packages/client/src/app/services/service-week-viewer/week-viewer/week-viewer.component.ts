import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';
import {
  eachDayOfInterval,
  endOfWeek,
  getTime,
  isWithinInterval,
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
  weekViewerController: WeekViewerController;

  @Input()
  itemFormTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  @Input()
  newItemFormTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  range: Map<number, WeekViewerItem[]>;

  isSingleMode = false;
  selectedDay = DEFAULT_WEEK_SWITCH;

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

  onDayClick(key: number): void {
    this.selectedDay = key;
  }

  getSelectedEntry(): { key: number; value: WeekViewerItem[] } {
    return {
      key: this.selectedDay,
      value: this.range.get(this.selectedDay),
    };
  }
}
