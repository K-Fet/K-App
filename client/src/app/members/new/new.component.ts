import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../member.model';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {

  @ViewChild('dialog') dialog: ModalComponent<Member>;

  constructor(private router: Router) {}

  ngOnInit() {
    this.dialog.afterClosed().subscribe(result => this.createMember(result));
  }

  createMember(newMember: Member) {
    console.log(newMember);
    // Workaround because angular does not really like lazy loading and named outlets
    this.router.navigate(['/members']);
  }
}
