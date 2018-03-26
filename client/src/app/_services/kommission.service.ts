import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Kommission } from '../_models/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class KommissionService {

    dataChange: BehaviorSubject<Kommission[]> = new BehaviorSubject<Kommission[]>([]);
    get data(): Kommission[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Kommission[]>('/api/kommissions');
    }

    getById(id: number) {
        return this.http.get<Kommission>('/api/kommissions/' + id);
    }

    create(kommission: Kommission) {
        return this.http.post('/api/kommissions', kommission);
    }

    update(kommission: Kommission) {
        const id = kommission.id;
        delete kommission.id;
        return this.http.put('/api/kommissions/' + id, kommission);
    }

    delete(id: Number) {
        return this.http.delete('/api/kommissions/' + id);
    }
}
