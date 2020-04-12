import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/api-services/auth.service';
import { Barman, isActiveBarman, isUserBarman, isUserGuest, isUserServiceAccount, User } from '../../shared/models';

@Component({
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {

  private currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((curUser) => {
      this.currentUser = curUser;
    });
  }

  getName(): string {
    if (isUserServiceAccount(this.currentUser)) {
      return this.currentUser.email;
    }
    if (isUserBarman(this.currentUser)) {
      return (this.currentUser.account as Barman).nickName;
    }
    return '';
  }

  isConnected(): boolean {
    return !isUserGuest(this.currentUser);
  }

  isActive(): boolean {
    return isActiveBarman(this.currentUser);
  }
}
