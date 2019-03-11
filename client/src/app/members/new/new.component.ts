import { Component, OnInit } from '@angular/core';
import { Member } from '../member.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  onClose(newMember: Member) {
    console.log(newMember);
    // Workaround because angular does not really like lazy loading and named outlets
    this.router.navigate(['/members']);
  }
}
