import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member, Registration } from '../_models';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Member[]> {
    // TODO: Make this customizable
    // For now we load all members, but API will send only those who are registered for this year.
    return this.http.get<Member[]>('/api/members?startAt=2000');
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`/api/members/${id}`);
  }

  create(member: Member): Observable<Member> {
    return this.http.post<Member>('/api/members', member);
  }

  update(member: Member): Observable<Member> {
    return this.http.put<Member>(`/api/members/${member.id}`, member);
  }

  delete(id: number, code: number): Observable<Member> {
    return this.http.post<Member>(`/api/members/${id}/delete`, { code });
  }

  register(id: number): Observable<Registration> {
    return this.http.post<Registration>(`/api/members/${id}/register`, {});
  }
}
