import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Role } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RoleService {

    dataChange: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
    get data(): Role[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Role[]>('/api/roles').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Role>('/api/roles/' + id).catch(this.handleError);
    }

    create(role: Role) {
        return this.http.post('/api/roles', role).catch(this.handleError);
    }

    update(role: Role) {
        return this.http.put('/api/roles/' + role.id, role).catch(this.handleError);
    }

    delete(id: Number) {
        return this.http.delete('/api/roles/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknownRole':
                    errorMessage = `Erreur, impossible de recuperer le role`;
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
