import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Barman, SpecialAccount, ConnectedUser } from '../_models/index';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class LoginService {

    currentUser: {
        username: String,
        createdAt: Date,
        accountType: String,
        barman?: Barman,
        specialAccount?: SpecialAccount
    };

    constructor(private http: HttpClient,
        private permissionsService: NgxPermissionsService,
        private router: Router) {

        if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser.jwt) {
                const jwtDecoded = jwt_decode(currentUser.jwt);
                if (+moment() < jwtDecoded.exp * 1000) {
                    this.permissionsService.addPermission(jwtDecoded.permissions);
                    // Update /me
                    this.me().subscribe();

                    // Refresh the token after 50ms to prevent other call.
                    setTimeout(() => {
                        this.refresh().subscribe();
                    }, 50);
                } else {
                    localStorage.removeItem('currentUser');
                    router.navigate(['/login']);
                }
            }
        }
    }

    login(username: string, password: string) {
        return this.http.post('/api/auth/login', {username, password})
            .do((jwt: { jwt: String }) => {
                if (jwt) {
                    localStorage.setItem('currentUser', JSON.stringify(jwt));
                }
                this.me();
                const jwtDecoded = jwt_decode(jwt.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh().subscribe();
                }, 45 * 60 * 60 * 1000);
            })
            .catch(this.handleError);
    }

    logout() {
        return this.http.get('/api/auth/logout').do(() => {
            if (localStorage.getItem('currentUser')) {
                localStorage.removeItem('currentUser');
            }
            this.permissionsService.flushPermissions();
            this.currentUser = undefined;
        }).catch(this.handleError);
    }

    refresh() {
        return this.http.get('/api/auth/refresh').do((newJWT: { jwt: String }) => {
            if (newJWT) {
                localStorage.setItem('currentUser', JSON.stringify(newJWT));
                const jwtDecoded = jwt_decode(newJWT.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh().subscribe();
                }, 45 * 60 * 60 * 1000);
            }
        }, err => {
            if (localStorage.getItem('currentUser')) {
                localStorage.removeItem('currentUser');
            }
            this.permissionsService.flushPermissions();
            this.currentUser = undefined;
            this.router.navigate(['/login']);
        });
    }

    me() {
        if (this.currentUser) {
            return Observable.of(this.currentUser);
        } else {
            return this.http.get<ConnectedUser>('/api/auth/me')
            .do(connectedUser => {
                if (connectedUser.barman) {
                    this.currentUser = {
                        accountType: 'Barman',
                        username:  connectedUser.barman.connection.username,
                        createdAt: connectedUser.barman.createdAt,
                        barman: connectedUser.barman,
                    };
                } else if (connectedUser.specialAccount) {
                    this.currentUser = {
                        accountType: 'SpecialAccount',
                        username:  connectedUser.specialAccount.connection.username,
                        createdAt: connectedUser.specialAccount.createdAt,
                        specialAccount: connectedUser.specialAccount,
                    };
                }
                return connectedUser;
            })
            .catch(this.handleError);
        }
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'LoginError':
                    errorMessage = `Erreur: username ou mot de passe invalide`;
                    break;
                case 'LogoutError':
                    errorMessage = `Erreur durant la déconnexion`;
                    break;
                case 'UnauthorizedError':
                    errorMessage = `Erreur: opération non autorisée`;
                    break;
                case 'ServerError':
                    errorMessage = `Erreur serveur`;
                    break;
                default:
                    errorMessage = 'Code d\'erreur inconnu';
                    break;
            }
        }
        return Observable.throw(errorMessage);
    }
}
