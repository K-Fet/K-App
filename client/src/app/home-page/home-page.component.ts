import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services';
import { ConnectedUser } from '../_models';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements OnInit {

  private currentUser: ConnectedUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((curUser) => {
      this.currentUser = curUser;
    });
  }

  getName(): string {
    if (this.currentUser.specialAccount) {
      return this.currentUser.email;
    } if (this.currentUser.barman) {
      return this.currentUser.barman.nickname;
    }
    return '';
  }

  isConnected(): Boolean {
    return this.currentUser.accountType !== 'Guest';
  }
}
