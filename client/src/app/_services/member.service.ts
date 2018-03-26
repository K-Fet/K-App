import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Member>> {
        return this.http.get<Array<Member>>('/api/members');
    }

    getById(id: number): Observable<Member> {
        return this.http.get<Member>(`/api/members/${id}`);
    }

    create(member: Member, code: Number): Observable<Member> {
        return this.http.post<Member>('/api/members', {code, member});
    }

    update(member: Member, code: Number): Observable<Member> {
        const id = member.id;
        delete member.id;

        return this.http.put<Member>(`/api/members/${id}`, {code, member});
    }

    delete(id: Number, code: Number): Observable<Member> {
        const options = {
            body: {
                code
            }
        };

        return this.http.request<Member>('DELETE', `/api/members/${id}`, options);
    }
}
