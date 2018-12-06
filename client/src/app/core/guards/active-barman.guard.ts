import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Barman } from '../../shared/models';
import { AuthService } from '../api-services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveBarmanGuard implements CanActivate {

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
