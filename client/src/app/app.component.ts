import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectedUser } from './shared/models';
import { AuthService } from './core/api-services/auth.service';
import { ToasterService } from './core/services/toaster.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'K-App';

  user: ConnectedUser;

  @ViewChild('sn', { static: true }) public sideNav: MatSidenav;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  async logout() {
    await this.authService.logout();
    this.toasterService.showToaster('Déconnexion réussie');
    this.router.navigate(['/']);
  }
}
