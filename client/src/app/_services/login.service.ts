import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Barman, SpecialAccount, ConnectedUser } from '../_models/index';

@Injectable()
export class LoginService {

    currentUser: {
        username: String,
        createdAt: Date,
        accountType: String,
        barman?: Barman,
        specialAccount?: SpecialAccount
    };

    isAuthenticated: Boolean;

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post('/api/auth/login', {username, password})
            .do(jwt => { this.me(); })
            .catch(this.handleError);
    }

    logout() {
        return this.http.get('/api/auth/logout').catch(this.handleError);
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
                        accountType: 'SpeacialAccount',
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
