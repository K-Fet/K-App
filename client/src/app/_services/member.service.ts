import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models';
import { Observable } from 'rxjs';

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
        return this.http.post<Member>('/api/members', { code: code, member: member });
    }

    update(member: Member, code: Number): Observable<Member> {
        return this.http.put<Member>(`/api/members/${member.id}`, { code: code, member: member });
    }

    delete(id: Number, code: Number): Observable<Member> {
        return this.http.post<Member>(`/api/members/${id}`, { code });
    }
}
