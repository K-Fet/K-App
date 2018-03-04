import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Member } from '../_models/index';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Member[]>('/api/members').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Member>('/api/members/' + id).catch(this.handleError);
    }

    create(member: Member, code: Number) {
        return this.http.post('/api/members', {code: code, member: member}).catch(this.handleError);
    }

    update(member: Member, code: Number) {
        return this.http.put('/api/members/' + member.id, {code: code, member: member}).catch(this.handleError);
    }

    delete(id: Number, code: Number) {
        return this.http.delete('/api/members/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible d'ajouter un adhérent`;
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
