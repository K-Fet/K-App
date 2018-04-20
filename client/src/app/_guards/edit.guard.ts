import { NgxPermissionsService } from 'ngx-permissions';
import { ConnectedUser } from './../_models';
import { AuthService } from './../_services';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
        private ngxPermissionsService: NgxPermissionsService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.$currentUser.map(connectedUser => {
            const id = +route.params['id'];
            if ((connectedUser.specialAccount && connectedUser.specialAccount.id === id)
                || (connectedUser.barman && connectedUser.barman.id === id)
                || this.ngxPermissionsService.getPermissions()['barman:write']
                || this.ngxPermissionsService.getPermissions()['specialaccount:write']) {
                return true;
            }

            this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url }});

            return false;
        });
    }
}
