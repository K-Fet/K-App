import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SpecialAccount } from '../_models/index';

import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpecialAccountService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<SpecialAccount[]>('/api/specialaccounts').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<SpecialAccount>('/api/specialaccounts/' + id).catch(this.handleError);
    }

    create(specialAccount: SpecialAccount, code:  Number) {
        return this.http.post('/api/specialaccounts', { specialAccount: specialAccount, code: code }).catch(this.handleError);
    }

    update(specialAccount: SpecialAccount, code: Number) {
        const body = { specialAccount: specialAccount, code: code };
        return this.http.put('/api/specialaccounts/' + specialAccount.id, body).catch(this.handleError);
    }

    delete(id: Number, code: Number) {
        const options = {
            body: {
                code: code,
            }
        };
        return this.http.request('DELETE', '/api/specialaccounts/' + id, options).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknownRole':
                    errorMessage = `Erreur, impossible de recuperer le compte spécial`;
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
