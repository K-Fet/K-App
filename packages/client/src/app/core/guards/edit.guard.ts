import { NgxPermissionsService } from 'ngx-permissions';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../api-services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EditGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private ngxPermissionsService: NgxPermissionsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.$currentUser
      .pipe(
        map((connectedUser) => {
          const id = +route.params['id'];
          if ((connectedUser.specialAccount && connectedUser.specialAccount.id === id)
            || (connectedUser.barman && connectedUser.barman.id === id)
            || this.ngxPermissionsService.getPermissions()['barman:write']
            || this.ngxPermissionsService.getPermissions()['specialaccount:write']) {
            return true;
          }

          this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });

          return false;
        }),
      );
  }
}
