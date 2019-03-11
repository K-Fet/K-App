import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from './member.model';
import { MoleculerList, MoleculerListOptions } from '../shared/models/MoleculerWrapper';
import { createHttpParams } from '../shared/utils';

const BASE_URL = '/api/v2/core/v1/members';

@Injectable()
export class MembersService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions = {}): Promise<MoleculerList<Member>> {
    return this.http.get<MoleculerList<Member>>(
      BASE_URL,
      {
        params: createHttpParams({
          ...options,
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

  create(shelf: Member): Promise<Member> {
    return this.http.post<Member>(BASE_URL, shelf).toPromise();
  }

  update(shelf: Member): Promise<Member> {
    return this.http.put<Member>(`${BASE_URL}/${shelf._id}`, shelf).toPromise();
  }

  remove(id: string): Promise<Member> {
    return this.http.delete<Member>(`${BASE_URL}/${id}`).toPromise();
  }

  register(id: string): Promise<Member> {
    return this.http.post<Member>(`${BASE_URL}/${id}`, {}).toPromise();
  }
}
