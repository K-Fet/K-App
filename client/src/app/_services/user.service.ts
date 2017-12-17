import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../_models/index';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
    dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    get data(): User[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>('/api/users').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<User>('/api/users/' + id);
    }

    create(user: User) {
        return this.http.post('/api/users', user).catch(this.handleError);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id).catch(this.handleError);
    }
    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votr connexion internet`;
        } else {
            console.log(err);
            switch (err.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible d'ajouter un utilisateur`;
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
