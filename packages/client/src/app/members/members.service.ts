import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from './member.model';
import { MoleculerGetOptions, MoleculerList, MoleculerListOptions } from '../shared/models/MoleculerWrapper';
import { createHttpParams } from '../shared/utils';
import { Subject } from 'rxjs';
import { toURL } from '../core/api-services/api-utils';

const BASE_URL = toURL('v2/core/v1/members');

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
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string, options: MoleculerGetOptions = {}): Promise<Member> {
    return this.http.get<Member>(
      `${BASE_URL}/${id}`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
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

  async register(id: string, newSchool?: string): Promise<Member> {
    const updatedMember = await this.http.post<Member>(`${BASE_URL}/${id}/register`, { newSchool }).toPromise();
    this.refreshSubject.next();
    return updatedMember;
  }
}
