import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export type WeekViewerItem = {
  key: symbol;
  start: Date;
  end: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export type WeekViewerChange = {
  type: 'removed' | 'created' | 'edited';
  item: WeekViewerItem;
}

export const sortItems = (items: WeekViewerItem[]): WeekViewerItem[] =>
  [...items].sort((a, b) => a.start.getTime() - b.start.getTime());


export class WeekViewerController {
  private changeSubject: Subject<WeekViewerChange> = new BehaviorSubject(null);
  readonly changes$: Observable<WeekViewerChange> = this.changeSubject.asObservable();

  private currentItems: WeekViewerItem[] = [];
  readonly items$: Observable<WeekViewerItem[]> = this.changes$
    .pipe(map((value) => {
      let newItems = this.currentItems;

      if (!value) return this.currentItems;

      switch (value.type) {
        case 'removed':
          newItems = this.currentItems.filter(item => item.key !== value.item.key);
          break;
        case 'created':
          newItems = [...this.currentItems, value.item];
          break;
        case 'edited':
          newItems = this.currentItems.map(item => item.key === value.item.key ? value.item : item);
          break;
      }
      this.currentItems = sortItems(newItems);
      return this.currentItems;
    }));

  constructor(initialItems?: WeekViewerItem[]) {
    this.resetItems(initialItems);
  }

  resetItems(newItems?: WeekViewerItem[]): void {
    this.currentItems = sortItems(newItems || []);
  }

  createItem(item: WeekViewerItem): void {
    this.changeSubject.next({ type: 'created', item });
  }

  removeItem(item: WeekViewerItem): void {
    this.changeSubject.next({ type: 'removed', item });
  }

  editItem(newItem: WeekViewerItem): void {
    this.changeSubject.next({ type: 'edited', item: newItem });
  }
}
