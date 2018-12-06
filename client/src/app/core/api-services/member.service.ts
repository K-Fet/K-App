import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member, Registration } from '../../shared-old/models';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService {

  constructor(private http: HttpClient) { }

  getAll(startAt: number, endAt: number): Observable<Member[]> {
    // TODO: Make this customizable
    // For now we load all members, but API will send only those who are registered for this year.
    return this.http.get<Member[]>('/api/v1/members', {
      params: {
        startAt: startAt.toString(),
        endAt: endAt.toString(),
      },
    });
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`/api/v1/members/${id}`);
  }

  create(member: Member): Observable<Member> {
    return this.http.post<Member>('/api/v1/members', member);
  }

  update(member: Member): Observable<Member> {
    return this.http.put<Member>(`/api/v1/members/${member.id}`, member);
  }

  delete(id: number, code: number): Observable<Member> {
    return this.http.post<Member>(`/api/v1/members/${id}/delete`, { code });
  }

  register(id: number): Observable<Registration> {
    return this.http.post<Registration>(`/api/v1/members/${id}/register`, {});
  }

  search(query: string, active: boolean): Observable<Member[]> {
    return this.http.post<Member[]>('/api/v1/members/search', {
      query,
      active,
    });
  }
}
