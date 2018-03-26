import { NgxPermissionsService } from 'ngx-permissions';
import { LoginService } from './../_services';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(private router: Router,
                private loginService: LoginService,
                private ngxPermissionsService: NgxPermissionsService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.$currentUser.map(connectedUser => {
            const id = route.params['id'];
            if ((connectedUser.specialAccount && connectedUser.specialAccount.id === id)
                || (connectedUser.barman && connectedUser.barman.id === id)
                || this.ngxPermissionsService.getPermissions()['barman:write']
                || this.ngxPermissionsService.getPermissions()['specialaccount:write']) return true;

            this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url }});

            return false;
        });
    }
}
