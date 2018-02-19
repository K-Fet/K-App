import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Kommission } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class KommissionService {

    dataChange: BehaviorSubject<Kommission[]> = new BehaviorSubject<Kommission[]>([]);
    get data(): Kommission[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Kommission[]>('/api/kommissions').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Kommission>('/api/kommissions/' + id).catch(this.handleError);
    }

    create(kommission: Kommission) {
        return this.http.post('/api/kommissions', kommission).catch(this.handleError);
    }

    update(kommission: Kommission) {
        return this.http.put('/api/kommissions/' + kommission.id, kommission).catch(this.handleError);
    }

    delete(id: Number) {
        return this.http.delete('/api/kommissions/' + id).catch(this.handleError);
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
