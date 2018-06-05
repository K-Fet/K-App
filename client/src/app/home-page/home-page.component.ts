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

  isConnected(): Boolean {
    return this.currentUser.accountType !== 'Guest';
  }
}
