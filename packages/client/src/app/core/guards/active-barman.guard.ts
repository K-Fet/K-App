import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../api-services/auth.service';
import { isActiveBarman } from '../../shared/models';

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
          if (isActiveBarman(connectedUser)) {
            return true;
          }

          this.router.navigate(['/services/services-explorer']);

          return false;
        }),
      );
  }
}
