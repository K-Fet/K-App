import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../_models';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Permission>> {
        return this.http.get<Array<Permission>>('/api/permissions');
    }
}
