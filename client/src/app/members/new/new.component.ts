import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../member.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {

  @ViewChild('dialog') dialog: ModalComponent<Member>;

  constructor() {}

  ngOnInit() {
    this.dialog.afterClosed().subscribe(result => this.createMember(result));
  }

  createMember(newMember: Member) {
    console.log(newMember);
  }
}
