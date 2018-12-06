import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConnectedUser } from './shared/models';
import { AuthService } from './core/api-services/auth.service';
import { ToasterService } from './core/services/toaster.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'K-App';

  mobileQuery: MediaQueryList;
  sidenavQuery: MediaQueryList;

  user: ConnectedUser;

  private readonly _mobileQueryListener: () => void;

  @ViewChild('sn') public sideNav: MatSidenav;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 599px)');
    this.sidenavQuery = media.matchMedia('(max-width: 1480px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.sidenavQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.toasterService.showToaster('Déconnexion réussie');
      this.router.navigate(['/']);
    });
  }
}
