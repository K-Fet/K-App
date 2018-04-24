import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Kommission } from '../_models';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class KommissionService {

    dataChange: BehaviorSubject<Array<Kommission>> = new BehaviorSubject<Array<Kommission>>([]);
    get data(): Array<Kommission> { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Kommission>> {
        return this.http.get<Array<Kommission>>('/api/kommissions');
    }

    getById(id: number): Observable<Kommission> {
        return this.http.get<Kommission>(`/api/kommissions/${id}`);
    }

    create(kommission: Kommission): Observable<Kommission> {
        return this.http.post<Kommission>('/api/kommissions', kommission);
    }

    update(kommission: Kommission): Observable<Kommission> {
        return this.http.put<Kommission>(`/api/kommissions/${kommission.id}`, kommission);
    }

    delete(id: Number): Observable<Kommission> {
        return this.http.post<Kommission>(`/api/kommissions/${id}/delete`, null);
    }
}
