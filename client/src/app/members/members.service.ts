import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from './member.model';
import { MoleculerList, MoleculerListOptions } from '../shared/models/MoleculerWrapper';
import { createHttpParams } from '../shared/utils';
import { Subject } from 'rxjs';

const BASE_URL = '/api/v2/core/v1/members';

export interface MembersOptions extends MoleculerListOptions {
  active?: boolean;
  inactive?: boolean;
}

@Injectable()
export class MembersService {

  private refreshSubject = new Subject<void>();

  public refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) { }

  list(options: MembersOptions = {}): Promise<MoleculerList<Member>> {
    return this.http.get<MoleculerList<Member>>(
      BASE_URL,
      {
        params: createHttpParams({
          ...options,
          active: options.active && options.active.toString(),
          inactive: options.inactive && options.inactive.toString(),
          page: options.page && options.page.toString(),
          pageSize: options.pageSize && options.pageSize.toString(),
        }),
      },
    ).toPromise();
  }

  get(id: string): Promise<Member> {
    // Always populate shelf with products
    return this.http.get<Member>(`${BASE_URL}/${id}`).toPromise();
  }

  async create(member: Member): Promise<Member> {
    const newMember = await this.http.post<Member>(BASE_URL, member).toPromise();
    this.refreshSubject.next();
    return newMember;
  }

  async update(member: Member): Promise<Member> {
    const updatedMember = await this.http.put<Member>(`${BASE_URL}/${member._id}`, member).toPromise();
    this.refreshSubject.next();
    return updatedMember;
  }

  async remove(id: string): Promise<Member> {
    const removedMember = await this.http.delete<Member>(`${BASE_URL}/${id}`).toPromise();
    this.refreshSubject.next();
    return removedMember;
  }

  register(id: string, newSchool?: string): Promise<Member> {
    return this.http.post<Member>(`${BASE_URL}/${id}/register`, { newSchool }).toPromise();
  }
}
