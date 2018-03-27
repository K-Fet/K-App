import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { ConnectedUser } from '../_models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {

    $currentUser: BehaviorSubject<ConnectedUser>;

    constructor(private http: HttpClient,
                private permissionsService: NgxPermissionsService,
                private router: Router) {
        this.$currentUser = new BehaviorSubject<ConnectedUser>(new ConnectedUser({
            accountType: 'Guest',
            createdAt: new Date()
        }));
        if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser.jwt) {
                const jwtDecoded = jwt_decode(currentUser.jwt);
                if (Date.now() < jwtDecoded.exp * 1000) {
                    this.permissionsService.addPermission(jwtDecoded.permissions);
                    // Update /me
                    this.me()
                    .subscribe();

                    // Refresh the token after 50ms to prevent other call.
                    setTimeout(() => {
                        this.refresh()
                        .subscribe();
                    }, 50);
                } else this.clearUser();
            }
        }
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post('/api/auth/login', {username, password})
            .do((jwt: { jwt: String }) => {
                this.saveUser(jwt);
                this.me()
                .subscribe();
                const jwtDecoded = jwt_decode(jwt.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);
                console.log(jwtDecoded);
                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh()
                    .subscribe();
                }, 45 * 60 * 60 * 1000);
            });
    }

    logout(): Observable<any> {
        return this.http.get('/api/auth/logout')
            .do(this.clearUser.bind(this));
    }

    refresh(): Observable<any> {
        return this.http.get('/api/auth/refresh')
            .do((newJWT: { jwt: String }) => {
            if (newJWT) {
                this.saveUser(newJWT);
                const jwtDecoded = jwt_decode(newJWT.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh()
                    .subscribe();
                }, 45 * 60 * 60 * 1000);
            }
        })
        .catch(err => {
            this.clearUser();

            return Observable.throw(err);
        });
    }

    private clearUser(): void {
        this.$currentUser.next(new ConnectedUser({
            accountType: 'Guest',
            createdAt: new Date()
        }));
        this.permissionsService.flushPermissions();
        if (localStorage.getItem('currentUser')) localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    private saveUser(jwt): void {
        localStorage.setItem('currentUser', JSON.stringify(jwt));
    }

    me(): Observable<ConnectedUser> {
        return this.http.get<ConnectedUser>('/api/me')
            .do(connectedUser => {
                if (connectedUser.barman)
                    this.$currentUser.next(new ConnectedUser({
                        accountType: 'Barman',
                        username: connectedUser.barman.connection.username,
                        createdAt: connectedUser.barman.createdAt,
                        barman: connectedUser.barman
                    }));
                else if (connectedUser.specialAccount)
                    this.$currentUser.next(new ConnectedUser({
                        accountType: 'SpecialAccount',
                        username: connectedUser.specialAccount.connection.username,
                        createdAt: connectedUser.specialAccount.createdAt,
                        specialAccount: connectedUser.specialAccount
                    }));
            });
    }
}
