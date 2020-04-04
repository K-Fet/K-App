import { Component, OnInit } from '@angular/core';
import { WeekViewerController } from '../service-week-viewer/week-viewer-controller';

@Component({
  selector: 'app-open-services',
  templateUrl: './open-services.component.html',
})

export class OpenServicesComponent implements OnInit {

  private weekViewerController: WeekViewerController;

  constructor() { }

  ngOnInit(): void {
    this.weekViewerController = new WeekViewerController([
      { key: '1', start: new Date(), end: new Date() },
      { key: '2', start: new Date(), end: new Date() },
      { key: '3', start: new Date(), end: new Date() },
    ]);
  }
}
