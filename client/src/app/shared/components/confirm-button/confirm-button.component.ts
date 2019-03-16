import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type MatButtonType = '' | 'flat' | 'stroked' | 'raised';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
})
export class ConfirmButtonComponent implements OnInit {

  @Output() click = new EventEmitter<Event>();
  @Input() debounceTime = 300;
  @Input() color = 'warn';
  @Input() matIconName = 'delete';
  @Input() matButtonType: MatButtonType = '';

  timesClicked = 0;
  clickSubject = new Subject<Event>();

  ngOnInit(): void {
    this.clickSubject.asObservable()
      .pipe(debounceTime(this.debounceTime))
      .subscribe(event => this.onClick(event));
  }

  onClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.timesClicked += 1;

    if (this.timesClicked > 1) {
      this.timesClicked = 0;
      return this.click.emit(event);
    }
  }
}
