import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy, Component} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { ToasterService } from '../_services/toaster.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  router: Router;

  private _mobileQueryListener: () => void;

  constructor(
    private loginService: LoginService,
    private toasterService: ToasterService,
    router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router = router;
  }

  logout() {
    this.loginService.logout().subscribe(res => {
      this.toasterService.showToaster('Déconnexion réussie', 'Fermer');
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, err => {
      this.toasterService.showToaster(err, 'Fermer');
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
