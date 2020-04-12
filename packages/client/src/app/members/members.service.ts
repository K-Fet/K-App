import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from './member.model';
import { toURL } from '../core/api-services/api-utils';
import { BaseCrudService } from '../core/api-services/base-crud.service';

export type AdditionalMembersOptions = {
  active?: boolean;
  inactive?: boolean;
}

@Injectable()
export class MembersService extends BaseCrudService<Member, AdditionalMembersOptions> {
  constructor(http: HttpClient) {
    super(http, toURL('v2/core/v1/members'));
  }

  async register(id: string, newSchool?: string): Promise<Member> {
    const updatedMember = await this.http.post<Member>(`${this.baseUrl}/${id}/register`, { newSchool }).toPromise();
    this.refreshSubject.next();
    return updatedMember;
  }
}
