import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Barman, SpecialAccount } from '../_models/index';

@Injectable()
export class LoginService {

    currentUser: {
        username: String,
        accountType: String,
        id: Number
    };

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post('/api/auth/login', {username, password})
            .catch(this.handleError);
    }

    logout() {
        return this.http.get('/api/auth/logout').catch(this.handleError);
    }

    me() {
        if (this.currentUser) {
            return Observable.of(this.currentUser);
        } else {
            return this.http.get<UserData>('/api/auth/me')
            .do(userData => {
                if (userData.barman) {
                    this.currentUser.accountType = 'Barman';
                    this.currentUser.username = userData.barman.connection.username;
                } else if (userData.specialAccount) {
                    this.currentUser.accountType = 'Special';
                    this.currentUser.username = userData.specialAccount.connection.username;
                }
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

interface UserData {
    barman: Barman;
    specialAccount: SpecialAccount;
}
