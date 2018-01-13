import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Barman } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BarmanService {

    dataChange: BehaviorSubject<Barman[]> = new BehaviorSubject<Barman[]>([]);
    get data(): Barman[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Barman[]>('/api/barmen').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Barman>('/api/barmen/' + id).catch(this.handleError);
    }

    create(barman: Barman) {
        return this.http.post('/api/barmen', barman).catch(this.handleError);
    }

    update(barman: Barman) {
        return this.http.put('/api/barmen/' + barman.id, barman).catch(this.handleError);
    }

    delete(id: number) {
        return this.http.delete('/api/barmen/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            console.log(err);
            switch (err.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible de recuperer le barman`;
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
