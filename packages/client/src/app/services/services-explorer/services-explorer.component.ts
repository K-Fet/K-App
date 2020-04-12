import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/api-services/auth.service';
import { isActiveBarman, User } from '../../shared/models';

@Component({
  templateUrl: './services-explorer.component.html',
})
export class ServiceExplorerComponent implements OnInit {

  private user: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  isActive(): boolean {
    return isActiveBarman(this.user);
  }
}
