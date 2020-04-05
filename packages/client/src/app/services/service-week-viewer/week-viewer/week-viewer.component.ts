import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';
import { eachDayOfInterval, endOfWeek, getDay, isWithinInterval, startOfWeek } from 'date-fns';
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

      this.range = new Map(eachDayOfInterval(interval).map(date => [getDay(date), []]));

      items
        .filter(item => isWithinInterval(item.start, interval))
        .forEach(item => this.range.get(getDay(item.start)).push(item));
      console.log(this.range);
    });
  }

  byKeyOrder(a: KeyValue<number, WeekViewerItem[]>, b: KeyValue<number, WeekViewerItem[]>): number {
    const normalizedA = a.key > DEFAULT_WEEK_SWITCH ? a.key - 7 : a.key;
    const normalizedB = b.key > DEFAULT_WEEK_SWITCH ? b.key - 7 : b.key;

    return normalizedA - normalizedB;
  }

  // ngx-date-fns set locale to french by default and have weekStartsOn to monday.
  // This is a ugly workaround to force use the english version.
  toFrenchWeekday(day: number): number {
    return day === 0 ? 6 : day - 1;
  }

  getContext(item: WeekViewerItem): { item: WeekViewerItem; controller: WeekViewerController } {
    return {
      item,
      controller: this.weekViewerController,
    };
  }

  onAdd() {
    // TODO Find start date and end date
    this.weekViewerController.createItem({
      key: '...',
      start: new Date(),
      end: new Date(),
    });
  }

}
