import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Member } from '../_models/index';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Member[]>('/api/members');
    }

    getById(id: number) {
        return this.http.get<Member>('/api/members/' + id);
    }

    create(member: Member, code: Number) {
        return this.http.post('/api/members', {code: code, member: member});
    }

    update(member: Member, code: Number) {
        const id = member.id;
        delete member.id;
        return this.http.put('/api/members/' + id, {code: code, member: member});
    }

    delete(id: Number, code: Number) {
        const options = {
            body: {
                code: code,
            }
        };
        return this.http.request('DELETE', '/api/members/' + id, options);
    }
}
