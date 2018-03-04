import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Barman, SpecialAccount, ConnectedUser } from '../_models/index';
import { setTimeout } from 'timers';

@Injectable()
export class LoginService {

    currentUser: {
        username: String,
        createdAt: Date,
        accountType: String,
        barman?: Barman,
        specialAccount?: SpecialAccount
    };

    constructor(private http: HttpClient) {
        setTimeout(() => {
            if (localStorage.getItem('currentUser')) {
                // Refresh the token after 50ms to prevent other call.
                this.refresh().subscribe();

                // Refresh token every 45 minutes
                Observable.interval(45 * 60 * 1000)
                .timeInterval()
                .flatMap(() => this.refresh())
                .subscribe();
            }
        }, 50);
    }

    login(username: string, password: string) {
        return this.http.post('/api/auth/login', {username, password})
            .do(jwt => {
                if (jwt) {
                    localStorage.setItem('currentUser', JSON.stringify(jwt));
                }
                this.me();

                // Refresh token every 45 minutes
                Observable.interval(45 * 60 * 1000)
                .timeInterval()
                .flatMap(() => this.refresh())
                .subscribe();
            })
            .catch(this.handleError);
    }

    logout() {
        return this.http.get('/api/auth/logout').do(() => {
            if (localStorage.getItem('currentUser')) {
                localStorage.removeItem('currentUser');
            }
            this.currentUser = undefined;
        }).catch(this.handleError);
    }

    refresh() {
        return this.http.get('/api/auth/refresh').do(newJWT => {
            if (newJWT) {
                localStorage.setItem('currentUser', JSON.stringify(newJWT));
            }
        }, err => {
            console.log(err);
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
