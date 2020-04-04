import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { WeekViewerController, WeekViewerItem } from '../week-viewer-controller';

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

  constructor() { }

  ngOnInit(): void {
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
