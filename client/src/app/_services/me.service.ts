import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ConnectedUser } from '../_models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MeService {

    constructor(private http: HttpClient) { }

    put(connectedUser: ConnectedUser) {
        let body;
        if (connectedUser.isBarman) {
            body = {
                barman: connectedUser.barman,
            };
            delete body.barman.id;
        } else {
            body = {
                specialAccount: connectedUser.specialAccount,
            };
            delete body.specialAccount.id;
        }

        return this.http.put('/api/me', body).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknownKommission':
                    errorMessage = `Erreur, impossible de recuperer la kommission`;
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
