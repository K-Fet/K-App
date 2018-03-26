import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from '../_models/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RoleService {

    dataChange: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
    get data(): Role[] { return this.dataChange.value; }

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Role[]>('/api/roles');
    }

    getById(id: number) {
        return this.http.get<Role>('/api/roles/' + id);
    }

    create(role: Role) {
        return this.http.post('/api/roles', role);
    }

    update(role: Role) {
        const id = role.id;
        delete role.id;
        return this.http.put('/api/roles/' + id, role);
    }

    delete(id: Number) {
        return this.http.delete('/api/roles/' + id);
    }
}
