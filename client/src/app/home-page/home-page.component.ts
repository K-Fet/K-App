import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services';
import { ConnectedUser } from '../_models';

@Component({
  templateUrl: './home-page.component.html',
})

export class HomePageComponent implements OnInit {

  private currentUser: ConnectedUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((curUser) => {
      this.currentUser = curUser;
    });
  }

  getName(): String {
    if (this.currentUser.specialAccount) {
      return this.currentUser.specialAccount.connection.username;
    } if (this.currentUser.barman) {
      return this.currentUser.barman.nickname;
    }
    return '';
  }

  isConnected(): Boolean {
    return this.currentUser.accountType !== 'Guest';
  }
}
