import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Category } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CategoryService {

    dataChange: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
    get data(): Category[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Category[]>('/api/categories').catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get<Category>('/api/categories/' + id).catch(this.handleError);
    }

    create(category: Category) {
        return this.http.post('/api/categories', category).catch(this.handleError);
    }

    update(category: Category) {
        return this.http.put('/api/categories/' + category.id, category).catch(this.handleError);
    }

    delete(id: number) {
        return this.http.delete('/api/categories/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknownCategory':
                    errorMessage = `Erreur, impossible de recuperer la categorie de service`;
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
