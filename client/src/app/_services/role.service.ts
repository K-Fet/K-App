import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from '../_models';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class RoleService {

    dataChange: BehaviorSubject<Array<Role>> = new BehaviorSubject<Array<Role>>([]);
    get data(): Array<Role> { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Role>> {
        return this.http.get<Array<Role>>('/api/roles');
    }

    getById(id: number): Observable<Role> {
        return this.http.get<Role>(`/api/roles/${id}`);
    }

    create(role: Role): Observable<Role> {
        return this.http.post<Role>('/api/roles', role);
    }

    update(role: Role): Observable<Role> {
        const id = role.id;
        delete role.id;
        return this.http.put<Role>(`/api/roles/${id}`, role);
    }

    delete(id: Number): Observable<Role> {
        return this.http.post<Role>(`/api/roles/${id}/delete`, null);
    }
}
