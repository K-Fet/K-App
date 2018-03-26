import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../_models/index';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class PermissionService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Permission[]>('/api/permissions');
    }
}
