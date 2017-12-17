import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Member } from '../_models/index';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberService {
    dataChange: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
    get data(): Member[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Member[]>('/api/members').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Member>('/api/members/' + id);
    }

    create(member: Member) {
        return this.http.post('/api/members', member).catch(this.handleError);
    }

    update(member: Member) {
        return this.http.put('/api/members/' + member.id, member);
    }

    delete(id: number) {
        return this.http.delete('/api/members/' + id).catch(this.handleError);
    }
    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votr connexion internet`;
        } else {
            console.log(err);
            switch (err.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible d'ajouter un adhérent`;
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
