import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { ConnectedUser } from '../_models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { roles } from '../_helpers/roles';

@Injectable()
export class AuthService {

    $currentUser: BehaviorSubject<ConnectedUser>;

    constructor(private http: HttpClient,
                private ngxPermissionsService: NgxPermissionsService,
                private ngxRolesService: NgxRolesService,
                private router: Router) {
        this.$currentUser = new BehaviorSubject<ConnectedUser>(new ConnectedUser({
            accountType: 'Guest',
            createdAt: new Date(),
        }));
        if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser.jwt) {
                const jwtDecoded = jwt_decode(currentUser.jwt);
                if (Date.now() < jwtDecoded.exp * 1000) {
                    this.managePermissionAndRole(jwtDecoded.permissions);

                    // Update /me
                    this.me().subscribe();

                    // Refresh the token after 50ms to prevent other call.
                    setTimeout(() => {
                        this.refresh().subscribe();
                    }, 50);
                } else {
                    this.clearUser();
                }
            }
        }
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post('/api/auth/login', { username, password })
            .do((jwt: { jwt: String }) => {
                this.saveUser(jwt);
                this.me().subscribe();
                const jwtDecoded = jwt_decode(jwt.jwt);
                this.managePermissionAndRole(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh().subscribe();
                }, 45 * 60 * 60 * 1000);
            });
    }

    logout(): Observable<any> {
        return this.http.get('/api/auth/logout')
            .do(this.clearUser.bind(this));
    }

    refresh(): Observable<any> {
        return this.http.get('/api/auth/refresh').do((newJWT: { jwt: String }) => {
            if (newJWT) {
                this.saveUser(newJWT);
                const jwtDecoded = jwt_decode(newJWT.jwt);
                this.managePermissionAndRole(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh().subscribe();
                }, 45 * 60 * 60 * 1000);
            }
        }).catch(err => {
            this.clearUser();
            return Observable.throw(err);
        });
    }

    definePassword(username: String, password: String, passwordToken: String): Observable<any> {
        return this.http.put('api/auth/reset-password', { username , password, passwordToken });
    }

    verifyUsername(userId: Number, username: String, password: String, usernameToken: String): Observable<any> {
        return this.http.post('api/auth/username-verification', { userId, username, password, usernameToken });
    }

    private clearUser(): void {
        this.$currentUser.next(new ConnectedUser({
            accountType: 'Guest',
            createdAt: new Date(),
        }));
        this.ngxPermissionsService.flushPermissions();
        this.ngxRolesService.flushRoles();
        if (localStorage.getItem('currentUser')) {
            localStorage.removeItem('currentUser');
        }
        this.router.navigate(['/login']);
    }

    private saveUser(jwt): void {
        localStorage.setItem('currentUser', JSON.stringify(jwt));
    }

    private managePermissionAndRole(permissions: Array<string>): void {
        this.ngxPermissionsService.addPermission(permissions);
        roles.forEach(role => {
            if (permissions.filter(perm => role.permissions.includes(perm)).length === role.permissions.length) {
                this.ngxRolesService.addRole(role.name, role.permissions);
            }
        });
    }

    me(): Observable<any> {
        return this.http.get<ConnectedUser>('/api/me')
            .do(connectedUser => {
                if (connectedUser.barman) {
                    this.$currentUser.next(new ConnectedUser({
                        accountType: 'Barman',
                        username: connectedUser.barman.connection.username,
                        createdAt: connectedUser.barman.createdAt,
                        barman: connectedUser.barman,
                    }));
                } else if (connectedUser.specialAccount) {
                    this.$currentUser.next(new ConnectedUser({
                        accountType: 'SpecialAccount',
                        username: connectedUser.specialAccount.connection.username,
                        createdAt: connectedUser.specialAccount.createdAt,
                        specialAccount: connectedUser.specialAccount,
                    }));
                }
            });
    }

    resetPassword(username: String): Observable<any> {
        return this.http.post('/api/auth/reset-password', { username });
    }
}
