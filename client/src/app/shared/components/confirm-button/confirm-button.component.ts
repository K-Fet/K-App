import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
  styleUrls: ['./confirm-button.component.scss'],
})
export class ConfirmButtonComponent implements OnInit {

  @Output() click = new EventEmitter<Event>();
  @Input() throttleTime = 500;
  @Input() color = 'warn';
  @Input() matIconName = 'delete';

  wasClicked = false;
  clickSubject = new Subject<void>();

  ngOnInit(): void {
    this.clickSubject.asObservable()
      .pipe(throttleTime(this.throttleTime))
      .subscribe(() => this.onValidatedClick());
  }

  onValidatedClick() {
    if (!this.wasClicked) {
      this.wasClicked = true;
      return;
    }
    // Reset
    this.wasClicked = false;
    return this.click.emit(event);
  }

  onClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.clickSubject.next();
  }
}
