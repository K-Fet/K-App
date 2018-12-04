import { AuthService } from '../_services';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Barman } from '../_models';

@Injectable()
export class ActiveGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.$currentUser
      .pipe(
        map((connectedUser) => {
          if (connectedUser.isBarman() && new Barman(connectedUser.barman).isActive()) {
            return true;
          }

          this.router.navigate(['/services-explorer']);

          return false;
        }),
      );
  }
}
