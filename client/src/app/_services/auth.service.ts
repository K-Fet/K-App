import { ConnectionInformation } from './../_models/ConnectionInformation';
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { SpecialAccount, ConnectedUser} from '../_models';
import * as jwt_decode from 'jwt-decode';
import {NgxPermissionsService} from 'ngx-permissions';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

    $currentUser: BehaviorSubject<ConnectedUser>;

    constructor(private http: HttpClient,
                private permissionsService: NgxPermissionsService,
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
                    this.permissionsService.addPermission(jwtDecoded.permissions);
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

    login(username: string, password: string) {
        return this.http.post('/api/auth/login', {username, password})
            .do((jwt: { jwt: String }) => {
                this.saveUser(jwt);
                this.me().subscribe();
                const jwtDecoded = jwt_decode(jwt.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);

                // Refresh token every 45 minutes
                setTimeout(() => {
                    this.refresh().subscribe();
                }, 45 * 60 * 60 * 1000);
            })
            .catch(this.handleError.bind(this));
    }

    logout() {
        return this.http.get('/api/auth/logout')
            .do(this.clearUser.bind(this))
            .catch(this.handleError.bind(this));
    }

    refresh() {
        return this.http.get('/api/auth/refresh').do((newJWT: { jwt: String }) => {
            if (newJWT) {
                this.saveUser(newJWT);
                const jwtDecoded = jwt_decode(newJWT.jwt);
                this.permissionsService.addPermission(jwtDecoded.permissions);

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
        return this.http.put('api/reset-password?password-token=' + passwordToken,
            { username: username, password: password });
    }

    verifyUsername(username: String, password: String, usernameToken: String): Observable<any> {
        return this.http.put('api/username-verification?usernameToken=' + usernameToken,
            { username: username, password: password });
    }

    private clearUser() {
        this.$currentUser.next(new ConnectedUser({
            accountType: 'Guest',
            createdAt: new Date(),
        }));
        this.permissionsService.flushPermissions();
        if (localStorage.getItem('currentUser')) {
            localStorage.removeItem('currentUser');
        }
        this.router.navigate(['/login']);
    }

    private saveUser(jwt) {
        localStorage.setItem('currentUser', JSON.stringify(jwt));
    }

    me() {
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
            })
            .catch(this.handleError.bind(this));
    }

    resetPassword(username: String): Observable<any> {
        return this.http.post('/api/reset-password', { username: username }).catch(this.handleError.bind(this));
    }

    private handleError(err: HttpErrorResponse) {
        console.error(err);
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
