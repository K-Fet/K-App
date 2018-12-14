import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from '../../core/api-services/auth.service';
import { Barman, ConnectedUser } from '../../shared/models';

@Component({
  templateUrl: './services-explorer.component.html',
})
export class ServiceExplorerComponent implements OnInit {

  private user: ConnectedUser;

  constructor(private authService: AuthService, private ngxPermissionsService: NgxPermissionsService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  isActive(): boolean {
    return this.user.isBarman() && new Barman(this.user.barman).isActive();
  }

  hasServiceWritePerm(): boolean {
    return !!this.ngxPermissionsService.getPermissions()['service:write'];
  }
}
